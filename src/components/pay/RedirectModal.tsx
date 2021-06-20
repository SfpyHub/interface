import React, { useCallback } from 'react'
import { Text } from 'rebass'
import TransactionConfirmationModal, {
	RedirectionModal,
	ConfirmationModalContent,
	TransactionErrorContent,
	CancelPendingContent
} from '../TransactionConfirmationModal'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { ButtonError } from '../Button'
import { PayCallbackError } from './styleds'

export function RedirectModal({
	redirectURL,
	success,
	onDismiss,
	isOpen
}: {
	redirectURL: string
	success: boolean
	isOpen: boolean
	onDismiss: () => void
}) {

	const confirmationContent = useCallback(
    () =>
      redirectURL ? (
        <RedirectionModal success={success} redirectURL={redirectURL} />
      ) : null,
    [onDismiss, redirectURL]
  )

	return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={false}
      content={confirmationContent}
      pendingText={undefined}
      hash={undefined}
    />
  )
}

function CancelModalHeader({ merchant }: { merchant: string }) {
  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
    	<Text>Are you sure you want to cancel this payment?</Text>
    	<Text fontSize={14}>Confirming will send you back to {merchant}</Text>
    </AutoColumn>
  )
}

function CancelModalFooter({
  onConfirm,
  cancelErrorMessage,
  disabledConfirm,
}: {
  onConfirm: () => void
  cancelErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  return (
    <>
      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-cancel"
        >
          <Text fontSize={20} fontWeight={500}>
            Cancel Payment
          </Text>
        </ButtonError>

        {cancelErrorMessage ? <PayCallbackError error={cancelErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}

export function ConfirmCancelModal({
	redirectURL,
	merchant,
	isOpen,
	attempting,
	cancelled,
	cancelErrorMessage,
	onDismiss,
	onConfirm
}: {
	redirectURL: string
	merchant: string
	isOpen: boolean
	attempting: boolean
	cancelled: boolean
	cancelErrorMessage: string | undefined
	onDismiss: () => void
	onConfirm: () => void
}) {
	const modalHeader = useCallback(() => {
    return merchant ? <CancelModalHeader merchant={merchant} /> : null
  }, [merchant])

  const modalBottom = useCallback(() => {
    return redirectURL ? (
      <CancelModalFooter onConfirm={onConfirm} disabledConfirm={false} cancelErrorMessage={cancelErrorMessage} />
    ) : null
  }, [onConfirm])

  // text to show while loading
  const pendingText = `Cancelling transaction, please wait`

  const confirmationContent = useCallback(
    () =>
      cancelErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={cancelErrorMessage} />
      ) : attempting ? (
      	<CancelPendingContent 
      		onDismiss={onDismiss}
      		pendingText={pendingText}
      	/>
      ) : cancelled ? (
      	<RedirectionModal success={false} redirectURL={redirectURL} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Cancel"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, attempting, cancelled, pendingText, modalHeader, modalBottom, cancelErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      content={confirmationContent}
      attemptingTxn={false}
      hash={undefined}
      pendingText={undefined}
    />
  )
}