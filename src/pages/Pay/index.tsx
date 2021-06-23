import { CurrencyAmount } from '@sfpy/web3-sdk'
import React, { useContext, useCallback, useState, useEffect } from 'react'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonConfirmed } from '../../components/Button'
import Card from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import ConfirmPayModal from '../../components/pay/ConfirmPayModal'
import { RedirectModal, ConfirmCancelModal } from '../../components/pay/RedirectModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import AddressInputPanel from '../../components/AddressPanel'
import ReceiverInputPanel from '../../components/ReceiverInputPanel'
import { AutoRow, RowBetween } from '../../components/Row'
import { ArrowWrapper, BottomGrouping, Wrapper, Dots, ClickableText } from '../../components/pay/styleds'
import { Field } from '../../state/pay/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { ApprovalState, useApproveCallbackFromPayment } from '../../hooks/useApproveCallback'
import ExchangeRate from '../../components/pay/ExchangeRate'
import PriceBreakdown from '../../components/PriceBreakdown'
import Loader from '../../components/Loader'
import ProgressSteps from '../../components/ProgressSteps'
import { LinkStyledButton } from '../../theme'
import { useDerivedPayInfo, usePayActionHandlers, usePaymentResponse, usePaymentState, useCancelOrderCallback } from '../../state/pay/hooks'
import { useAllTransactions } from '../../state/transactions/hooks'
import { usePayCallback } from '../../hooks/usePayCallback'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { ApiState } from '../../api'

import AppBody from '../AppBody'

export default function Pay() {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const wrapped = usePaymentResponse()
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // toggle merchant address
  const [showMerchantAddress, setShowMerchantAddress] = useState<boolean>(false)

  const [state] = usePaymentState()
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { rate, amountIn, recipient, requestId, currencies, inputError: payInputError } = useDerivedPayInfo()
  const isValid = !payInputError

  const hideCancelButton = (
    wrapped?.order?.status === 'PAID' || 
    wrapped?.order?.status === 'CANCELLED' || 
    state === ApiState.LOADING ||
    !wrapped?.order?.cancelURL
  )

  // modal and loading
  const [{ showConfirm, amountToConfirm, payErrorMessage, attemptingTxn, txHash }, setPayState] = useState<{
    showConfirm: boolean
    amountToConfirm: CurrencyAmount | undefined
    attemptingTxn: boolean
    payErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    amountToConfirm: undefined,
    attemptingTxn: false,
    payErrorMessage: undefined,
    txHash: undefined,
  })

  const [{ showRedirect, redirectURL }, setRedirectState] = useState<{
    showRedirect: boolean
    redirectURL: string | undefined
  }>({
    showRedirect: false,
    redirectURL: undefined
  })

  const [{ showCancel, cancelURL, attemptingCancel, cancelled, cancelErrorMessage }, setCancelState] = useState<{
    showCancel: boolean
    cancelURL: string | undefined
    attemptingCancel: boolean
    cancelled: boolean
    cancelErrorMessage: string | undefined
  }>({
    showCancel: false,
    cancelURL: undefined,
    attemptingCancel: false,
    cancelled: false,
    cancelErrorMessage: undefined
  })

  // get all transactions to use them to filter
  // for the potential txnHash
  const transactions = useAllTransactions()
  const transaction = transactions[txHash]
  const isAttempting = transaction && transaction.receipt === undefined
  const hasPaid = !isAttempting && transaction && transaction.receipt !== undefined

  const [approval, approveCallback] = useApproveCallbackFromPayment(rate)
  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const { onCurrencySelection } = usePayActionHandlers()

  const handleCurrencySelect = useCallback(
    (currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currency)
    },
    [onCurrencySelection]
  )

  const [showInverted, setShowInverted] = useState<boolean>(false)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !payInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const handleConfirmDismiss = useCallback(() => {
    setPayState({ showConfirm: false, amountToConfirm, attemptingTxn, payErrorMessage, txHash })
    
    if (wrapped?.order?.completeURL) {
      setRedirectState({ 
        showRedirect: !!txHash, 
        redirectURL: txHash ? wrapped.order.completeURL : "" 
      })
    }
  }, [attemptingTxn, payErrorMessage, amountToConfirm, txHash])

  // the callback to execute the payment
  const { callback: payCallback } = usePayCallback(amountIn, rate?.rawPrice(), requestId, recipient)
  const handlePayment = useCallback(() => {
    if (!payCallback) {
      return
    }
    setPayState({ attemptingTxn: true, amountToConfirm, showConfirm, payErrorMessage: undefined, txHash: undefined })
    payCallback()
      .then((hash) => {
        setPayState({ attemptingTxn: false, amountToConfirm, showConfirm, payErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setPayState({
          attemptingTxn: false,
          amountToConfirm,
          showConfirm,
          payErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [amountToConfirm, showConfirm, payCallback])

  const showCancelModal = useCallback(() => {
    if (wrapped?.order?.cancelURL) {
      setCancelState({ showCancel: true, cancelURL: wrapped.order.cancelURL, attemptingCancel, cancelled, cancelErrorMessage })
    }
  }, [wrapped, attemptingCancel, cancelled, cancelErrorMessage])

  const handleCancelDismiss = useCallback(() => {
    setCancelState({ showCancel: false, cancelURL: wrapped.order.cancelURL, attemptingCancel: false, cancelled: false, cancelErrorMessage: undefined })
  }, [wrapped])

  const { execute: cancelCallback } = useCancelOrderCallback()
  const handleCancel = useCallback(() => {
    if (!cancelCallback) {
      return
    }

    setCancelState({ showCancel, cancelURL, attemptingCancel: true, cancelled, cancelErrorMessage: undefined })
    cancelCallback()
      .then(() => {
        setCancelState({ showCancel, cancelURL, attemptingCancel: false, cancelled: true, cancelErrorMessage: undefined })
      })
      .catch((error) => {
        setCancelState({ showCancel, cancelURL, attemptingCancel: false, cancelled: false, cancelErrorMessage: error })
      })
  }, [showCancel, cancelURL, cancelled, cancelCallback])

  return (
    <AppBody>
      <Wrapper id="pay-page">
        <ConfirmCancelModal
          redirectURL={cancelURL}
          isOpen={showCancel}
          merchant={wrapped?.client.name}
          attempting={attemptingCancel}
          cancelled={cancelled}
          cancelErrorMessage={cancelErrorMessage}
          onDismiss={handleCancelDismiss}
          onConfirm={handleCancel}
        />
        <RedirectModal
          redirectURL={redirectURL}
          isOpen={showRedirect}
          success={true}
          onDismiss={() => {}}
        />
        <ConfirmPayModal
          isOpen={showConfirm}
          rate={rate}
          inputAmount={amountIn}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          onConfirm={handlePayment}
          payErrorMessage={payErrorMessage}
          onDismiss={handleConfirmDismiss}
        />
        <AutoColumn gap={'md'}>
          <ReceiverInputPanel
            id="pay-to-recipient"
            label="To"
            name={wrapped?.client?.name}
            bgImg={wrapped?.client?.backgroundImg}
            profileImg={wrapped?.client?.profileImg}
            website={wrapped?.client?.websiteURL}
            instagram={wrapped?.client?.instagramURL}
            twitter={wrapped?.client?.twitterURL}
            loading={state === ApiState.LOADING}
          />
          <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
            <PriceBreakdown
              subtotal={wrapped?.order?.subTotal}
              estimatedTax={wrapped?.order?.taxTotal}
              discount={wrapped?.order?.discountTotal}
              total={wrapped?.order?.grandTotal}
              loading={state === ApiState.LOADING}
            />
          </Card>
          <AutoColumn justify="space-between">
            <AutoRow justify={'space-between'} style={{ padding: '0.25rem 1rem' }}>
              <ArrowWrapper clickable>
                <ArrowDown size="16" onClick={() => {}} color={theme.text2} />
              </ArrowWrapper>
              {wrapped?.order?.recipient ? (
                <LinkStyledButton id="add-recipient-button" onClick={() => setShowMerchantAddress(!showMerchantAddress)}>
                  {showMerchantAddress ? 
                    '- Hide merchant address' : '+ Show merchant address'
                  }
                </LinkStyledButton>
              ) : null}
            </AutoRow>
          </AutoColumn>
          {wrapped?.order?.recipient && showMerchantAddress
            ? <AddressInputPanel id="recipient" address={wrapped?.order?.recipient} />
            : null
          }
          <CurrencyInputPanel
            id="pay-currency-input"
            label="Pay"
            value={amountIn?.toSignificant(6)}
            currency={currencies[Field.INPUT]}
            onCurrencySelect={handleCurrencySelect}
            disableCurrencySelect={false}
          />
          <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
            <AutoColumn gap="4px">
              <RowBetween align="center">
                <Text fontWeight={500} fontSize={14} color={theme.text2}>
                  Exchange Rate
                </Text>
                <ExchangeRate
                  price={rate?.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </RowBetween>
            </AutoColumn>
          </Card>
          <BottomGrouping>
            {state === ApiState.LOADING ? (
              <ButtonLight disabled>
                Loading
                <Dots />
              </ButtonLight>
            ) : !account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                    'Approve ' + currencies[Field.INPUT]?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    setPayState({
                      amountToConfirm: amountIn,
                      attemptingTxn: false,
                      payErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    })
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={hasPaid || isAttempting || !isValid || approval !== ApprovalState.APPROVED}
                  error={false}
                >
                  {isAttempting ? (
                    <AutoRow gap="6px" justify="center">
                      Paying <Loader stroke="white" />
                    </AutoRow>
                  ) : hasPaid ? (
                    <Text fontSize={16} fontWeight={500}>
                      Paid
                    </Text>
                  ) : (
                    <Text fontSize={16} fontWeight={500}>
                      {payInputError ? payInputError : 'Pay'}
                    </Text>
                  )}
                </ButtonError>
              </RowBetween>
            ) : (
              <ButtonError
                onClick={() => {
                  setPayState({
                    amountToConfirm: amountIn,
                    attemptingTxn: false,
                    payErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                  })
                }}
                id="swap-button"
                disabled={isAttempting || !isValid}
                error={false}
              >
                {isAttempting ? (
                  <Text fontSize={16} fontWeight={500}>
                    Paying <Dots />
                  </Text>
                ) : (
                  <Text fontSize={16} fontWeight={500}>
                    {payInputError ? payInputError : 'Pay'}
                  </Text>
                )}
              </ButtonError>
            )}
            {showApproveFlow && (
              <Column style={{ marginTop: '1rem' }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
            {hideCancelButton ? null : (
              <Card padding={'.5rem .75rem 0 .75rem'} borderRadius={'20px'}>
                <ClickableText onClick={showCancelModal} fontSize={12} color={theme.text2}>
                  Cancel and return back to {wrapped?.client?.name}
                </ClickableText>
              </Card>
            )}
          </BottomGrouping>
        </AutoColumn>
      </Wrapper>
    </AppBody>
  )
}
