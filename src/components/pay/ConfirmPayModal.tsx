import { CurrencyAmount, Rate } from '@sfpy/web3-sdk'
import React, { useCallback } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../TransactionConfirmationModal'
import PayModalHeader from './PayModalHeader'
import PayModalFooter from './PayModalFooter'

export default function ConfirmPayModal({
  rate,
  inputAmount,
  onConfirm,
  onDismiss,
  isOpen,
  attemptingTxn,
  payErrorMessage,
  txHash,
}: {
  isOpen: boolean
  rate: Rate | undefined
  inputAmount: CurrencyAmount | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  payErrorMessage: string | undefined
  onConfirm: () => void
  onDismiss: () => void
}) {
  const modalHeader = useCallback(() => {
    return inputAmount ? <PayModalHeader inputAmount={inputAmount} /> : null
  }, [inputAmount])

  const modalBottom = useCallback(() => {
    return rate ? (
      <PayModalFooter rate={rate} onConfirm={onConfirm} disabledConfirm={false} payErrorMessage={payErrorMessage} />
    ) : null
  }, [onConfirm, payErrorMessage, rate])

  // text to show while loading
  const pendingText = `Paying ${inputAmount?.toSignificant(6)} ${inputAmount?.currency?.symbol}`

  const confirmationContent = useCallback(
    () =>
      payErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={payErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Payment"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalHeader, modalBottom, payErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
