import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { splitSignature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import ethers from 'ethers'
import React, { useContext, useState, useCallback, useMemo } from 'react'
import { RouteComponentProps } from 'react-router'
import { ArrowDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { ETHER } from '@sfpy/web3-sdk'
import { RefundTabs } from '../../components/NavigationTabs'
import { AutoColumn } from '../../components/Column'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { ArrowWrapper, BottomGrouping, Dots } from '../../components/pay/styleds'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AddressInputPanel from '../../components/AddressPanel'
import { RefundPositionCard } from '../../components/PositionCard'
import CurrencyLogo from '../../components/CurrencyLogo'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { Wrapper } from '../RemoveLiquidity/styleds'
import AppBody from '../AppBody'
import { useSinglePaymentState, useSinglePaymentDerivedInfo } from '../../state/requests/hooks'
import { ApiState } from '../../api'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { ROUTER_ADDRESS } from '../../constants'
import { useTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin, getRouterContract } from '../../utils'
import { wrappedToken } from '../../utils/wrappedCurrency'
import { usePoolContract } from '../../hooks/useContract'

export default function Refund({
  history,
  match: {
    params: { requestId, paymentId },
  },
}: RouteComponentProps<{ requestId: string; paymentId: string }>) {
  const theme = useContext(ThemeContext)
  const { library, account, chainId } = useActiveWeb3React()
  const state = useSinglePaymentState()
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const {
    payment,
    pool,
    inputCurrency,
    amountOut,
    userLiquidity,
    liquidityToBurn,
    inputError,
  } = useSinglePaymentDerivedInfo(paymentId)
  const isValid = !inputError

  const token = useMemo(() => wrappedToken(inputCurrency, chainId), [inputCurrency, chainId])
  const poolContract: Contract | null = usePoolContract(pool?.liquidityToken?.address)

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(userLiquidity, ROUTER_ADDRESS)

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)

  // txn values
  const [txnHash, setTxnHash] = useState<string>('')
  const deadline = useTransactionDeadline()

  let paymentHex
  if (paymentId) {
    const bytes = ethers.utils.toUtf8Bytes(paymentId)
    paymentHex = `${ethers.utils.hexlify(bytes)}000000000000000000000000`
    console.log(paymentHex)
  }

  async function onAttemptToApprove() {
    if (!poolContract || !pool || !library || !deadline) {
      throw new Error('missing dependecies')
    }
    const liquidityAmount = userLiquidity
    if (!liquidityAmount) {
      throw new Error('missing liquidity amount')
    }

    // try to gather a signature for permission
    const nonce = await poolContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Safepay',
      version: '1',
      chainId: chainId,
      verifyingContract: pool.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS,
      value: liquidityToBurn.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        })
      })
      .catch((error) => {
        console.log(error)
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependecies')
    if (!amountOut) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    if (!inputCurrency) throw new Error('missing tokens')
    const liquidityAmount = userLiquidity
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyIsETH = inputCurrency === ETHER

    if (!token) throw new Error('no token')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      if (currencyIsETH) {
        methodNames = ['refundETH']
        args = [paymentHex, amountOut.raw.toString(), payment?.fromAddress, deadline.toHexString()]
      } else {
        // removeLiquidity
        methodNames = ['refund']
        args = [token.address, amountOut.raw.toString(), paymentHex, payment?.fromAddress, deadline.toHexString()]
      }
    } else if (signatureData !== null) {
      if (currencyIsETH) {
        methodNames = ['refundETHWithPermit']
        args = [
          paymentHex,
          amountOut.raw.toString(),
          payment?.fromAddress,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      } else {
        methodNames = ['refundWithPermit']
        args = [
          token.address,
          amountOut.raw.toString(),
          paymentHex,
          payment?.fromAddress,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: 'Refunded ' + amountOut?.toSignificant(3) + ' ' + inputCurrency?.symbol,
          })

          setTxnHash(response.hash)
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error)
        })
    }
  }

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={24} fontWeight={500}>
            {amountOut?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={inputCurrency} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {inputCurrency?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Text color={theme.text2} fontWeight={500} fontSize={16}>
            SFPY - {inputCurrency?.symbol} Burned
          </Text>
          <RowFixed>
            <CurrencyLogo currency={inputCurrency} />
            <Text fontWeight={500} fontSize={16}>
              {liquidityToBurn?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        <ButtonPrimary disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)} onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Refunding ${amountOut?.toSignificant(6)} ${inputCurrency?.symbol}`

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    setTxnHash('')
  }, [setShowConfirm, setSignatureData, setTxnHash])

  return (
    <>
      <AppBody>
        <RefundTabs requestId={requestId} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txnHash ? txnHash : ''}
            content={() => (
              <ConfirmationModalContent
                title={'You are returning'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap={'md'}>
            {amountOut && inputCurrency && (
              <CurrencyInputPanel
                id="refund-currency-input"
                label="Refund"
                value={amountOut?.toSignificant(6)}
                currency={inputCurrency}
                disableCurrencySelect
                hideBalance
              />
            )}
            <AutoColumn justify="space-between">
              <AutoRow justify={'center'} style={{ padding: '0 1 rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown size="16" onClick={() => {}} color={theme.text2} />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            {payment && <AddressInputPanel id="recipient" address={payment.fromAddress} />}
            <BottomGrouping>
              {state === ApiState.LOADING ? (
                <ButtonLight disabled>
                  Loading
                  <Dots />
                </ButtonLight>
              ) : !account ? (
                <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
              ) : inputError ? (
                <ButtonError onClick={() => {}} id="refund-button" disabled={!isValid} error={false}>
                  <Text fontSize={16} fontWeight={500}>
                    {inputError}
                  </Text>
                </ButtonError>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={onAttemptToApprove}
                    confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                    disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                    mr="0.5rem"
                    fontWeight={500}
                    fontSize={16}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>Approving</Dots>
                    ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                      'Approved'
                    ) : (
                      'Approve'
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      setShowConfirm(true)
                    }}
                    disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                    error={!isValid && !!inputCurrency}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {'Refund'}
                    </Text>
                  </ButtonError>
                </RowBetween>
              )}
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      {pool ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <RefundPositionCard pool={pool} />
        </AutoColumn>
      ) : null}
    </>
  )
}
