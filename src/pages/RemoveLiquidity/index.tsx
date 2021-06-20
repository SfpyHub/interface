import { BigNumber } from '@ethersproject/bignumber'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { Percent, ETHER } from '@sfpy/web3-sdk'
import React, { useContext, useMemo, useState, useCallback } from 'react'
import { ArrowDown } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonPrimary, ButtonLight, ButtonError, ButtonConfirmed } from '../../components/Button'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { RemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import ExchangeRate from '../../components/pay/ExchangeRate'
import { Dots } from '../../components/pay/styleds'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'

import Slider from '../../components/Slider'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useCurrency } from '../../hooks/useTokens'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedToken } from '../../utils/wrappedCurrency'
import AppBody from '../AppBody'
import { MaxButton, Wrapper } from './styleds'
import { useBurnActionHandlers } from '../../state/burn/hooks'
import { usePoolContract } from '../../hooks/useContract'
import { useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'
import { Field } from '../../state/burn/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { ROUTER_ADDRESS } from '../../constants'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin, getRouterContract } from '../../utils'

export default function RemoveLiquidity({
  history,
  match: {
    params: { currencyId },
  },
}: RouteComponentProps<{ currencyId: string }>) {
  const currency = useCurrency(currencyId) ?? undefined
  const { account, chainId, library } = useActiveWeb3React()
  const token = useMemo(() => wrappedToken(currency, chainId), [currency, chainId])

  const theme = useContext(ThemeContext)

  const toggleWalletModal = useWalletModalToggle()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pool, parsedAmounts, rate, error } = useDerivedBurnInfo(currency ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)

  // txn values
  const [txnHash, setTxnHash] = useState<string>('')
  const deadline = useTransactionDeadline()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY]:
      independentField === Field.CURRENCY ? typedValue : parsedAmounts[Field.CURRENCY]?.toSignificant(6) ?? '',
  }

  const poolContract: Contract | null = usePoolContract(pool?.liquidityToken?.address)

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    ROUTER_ADDRESS
  )

  async function onAttemptToApprove() {
    if (!poolContract || !pool || !library || !deadline) {
      throw new Error('missing dependecies')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
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
      value: liquidityAmount.raw.toString(),
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

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return _onUserInput(field, typedValue)
    },
    [_onUserInput]
  )

  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependecies')
    const { [Field.CURRENCY]: currencyAmount } = parsedAmounts
    if (!currencyAmount) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    if (!currency) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyIsETH = currency === ETHER

    if (!token) throw new Error('no token')

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      if (currencyIsETH) {
        methodNames = ['withdrawETH']
        args = [liquidityAmount.raw.toString(), '0', account, deadline.toHexString()]
      } else {
        // removeLiquidity
        methodNames = ['withdraw']
        args = [token.address, liquidityAmount.raw.toString(), '0', account, deadline.toHexString()]
      }
    } else if (signatureData !== null) {
      if (currencyIsETH) {
        methodNames = ['withdrawETHWithPermit']
        args = [
          liquidityAmount.raw.toString(),
          '0',
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      } else {
        methodNames = ['withdrawWithPermit']
        args = [
          token.address,
          liquidityAmount.raw.toString(),
          '0',
          account,
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
            summary: 'Remove ' + parsedAmounts[Field.CURRENCY]?.toSignificant(3) + ' ' + currency?.symbol,
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
            {parsedAmounts[Field.CURRENCY]?.toSignificant(6)}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currency} size={'24px'} />
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {currency?.symbol}
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
            SFPY - {currency?.symbol} Burned
          </Text>
          <RowFixed>
            <CurrencyLogo currency={currency} />
            <Text fontWeight={500} fontSize={16}>
              {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pool && (
          <>
            <RowBetween>
              <Text color={theme.text2} fontWeight={500} fontSize={16}>
                Price
              </Text>
              <Text fontWeight={500} fontSize={16} color={theme.text1}>
                1 {currency?.symbol} = {rate ? rate.executionPrice?.toSignificant(6) : '-'}{' '}
                {rate?.executionPrice?.baseCurrency?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <ButtonPrimary disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)} onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY]?.toSignificant(6)} ${currency?.symbol}`

  const liquidityPecentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txnHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
    setTxnHash('')
  }, [onUserInput, txnHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPecentChangeCallback
  )

  const [showInverted, setShowInverted] = useState<boolean>(false)

  return (
    <>
      <AppBody>
        <RemoveTabs />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txnHash ? txnHash : ''}
            content={() => (
              <ConfirmationModalContent
                title={'You will receive'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Text fontWeight={500}>Amount</Text>
                </RowBetween>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Text fontSize={72} fontWeight={500}>
                    {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                  </Text>
                </Row>
                <>
                  <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
                  <RowBetween>
                    <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')} width="20%">
                      25%
                    </MaxButton>
                    <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')} width="20%">
                      50%
                    </MaxButton>
                    <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')} width="20%">
                      75%
                    </MaxButton>
                    <MaxButton onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')} width="20%">
                      100%
                    </MaxButton>
                  </RowBetween>
                </>
              </AutoColumn>
            </LightCard>
            <>
              <ColumnCenter>
                <ArrowDown size="16px" color={theme.text2} />
              </ColumnCenter>
              <LightCard>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <Text fontSize={24} fontWeight={500}>
                      {formattedAmounts[Field.CURRENCY] || '-'}
                    </Text>
                    <RowFixed>
                      <CurrencyLogo currency={currency} style={{ marginRight: '12px' }} />
                      <Text fontSize={24} fontWeight={500} id="remove-liquidity-token-symbol">
                        {currency?.symbol}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                </AutoColumn>
              </LightCard>
            </>
            {rate && (
              <div style={{ padding: '10px 20px' }}>
                <RowBetween align="center">
                  <Text fontWeight={500} fontSize={16} color={theme.text2}>
                    Exchange Rate
                  </Text>
                  <ExchangeRate
                    size={16}
                    price={rate?.executionPrice}
                    showInverted={showInverted}
                    setShowInverted={setShowInverted}
                  />
                </RowBetween>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
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
                    error={!isValid && !!parsedAmounts[Field.CURRENCY]}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {error || 'Remove'}
                    </Text>
                  </ButtonError>
                </RowBetween>
              )}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      {pool ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard rate={rate} pool={pool} />
        </AutoColumn>
      ) : null}
    </>
  )
}
