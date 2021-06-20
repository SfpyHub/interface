import { Currency } from '@sfpy/web3-sdk'
import React, { useCallback, useState } from 'react'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  onCurrencySelect: (currency: Currency) => void
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect = () => {},
}: CurrencySearchModalProps) {
  const [listView] = useState<boolean>(false)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={listView ? 40 : 80}>
      <CurrencySearch isOpen={isOpen} onDismiss={onDismiss} onCurrencySelect={handleCurrencySelect} />
    </Modal>
  )
}
