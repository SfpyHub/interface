import ethers from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Router, PayParameters, CurrencyAmount } from '@sfpy/web3-sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from './useWeb3'
import { useTransactionDeadline } from './useTransactionDeadline'
import { calculateGasMargin, getRouterContract } from '../utils'
import { useTransactionAdder } from '../state/transactions/hooks'
import { isZero } from '../utils/isZero'
import useENS from './useENS'

export enum PayCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface PayCall {
  contract: Contract
  parameters: PayParameters
}

interface SuccessfulCall {
  call: PayCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: PayCall
  error: Error
}

type EstimatedPayCall = SuccessfulCall | FailedCall

/**
 * Returns the pay calls that can be used to make the payment
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function usePayCallArguments(
  inputAmount: CurrencyAmount | undefined,
  exchangeRate: CurrencyAmount | undefined,
  requestId: string | null,
  recipientAddressOrName: string | null
): PayCall[] {
  const { account, chainId, library } = useActiveWeb3React()
  // ToDo: add support for ENS
  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddress === null ? '' : recipientAddress
  const request = requestId === null ? '' : requestId
  const deadline = useTransactionDeadline()

  return useMemo(() => {
    if (!recipient || !library || !account || !chainId || !deadline || !inputAmount) {
      return []
    }

    const contract: Contract | null = getRouterContract(chainId, library, account)
    if (!contract) {
      return []
    }
    const bytes = ethers.utils.toUtf8Bytes(request)
    const payMethods = []
    payMethods.push(
      Router.payCallParameters(inputAmount, {
        recipient,
        rate: exchangeRate?.raw?.toString(),
        request: `${ethers.utils.hexlify(bytes)}000000000000000000000000`,
        deadline: deadline.toNumber(),
      })
    )

    return payMethods.map((parameters) => ({ parameters, contract }))
  }, [account, chainId, deadline, library, recipient, inputAmount, request, exchangeRate])
}

export function usePayCallback(
  inputAmount: CurrencyAmount | undefined,
  exchangeRate: CurrencyAmount | undefined,
  requestId: string | null,
  recipientAddressOrName: string | null
): { state: PayCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const payCalls = usePayCallArguments(inputAmount, exchangeRate, requestId, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!inputAmount || !library || !account || !chainId) {
      return { state: PayCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (recipientAddressOrName === null || requestId === null) {
      return { state: PayCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }

    return {
      state: PayCallbackState.VALID,
      callback: async function onPay(): Promise<string> {
        const estimatedCalls: EstimatedPayCall[] = await Promise.all(
          payCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estiamte gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError)
                    let errorMessage: string
                    console.log(callError.reason)
                    errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are using.`
                    return { call, error: new Error(errorMessage) }
                  })
              })
          })
        )

        // a success estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            console.log(response)
            addTransaction(response, {
              summary: 'Successfully completed payment',
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Payment failed`, error, methodName, args, value)
              throw new Error(`Payment failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [inputAmount, library, account, chainId, recipientAddressOrName, payCalls, addTransaction, requestId])
}
