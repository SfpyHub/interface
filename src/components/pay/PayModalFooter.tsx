import { Rate } from '@sfpy/web3-sdk'
import React, { useContext, useState } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import ExchangeRate from './ExchangeRate'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'
import { PayCallbackError } from './styleds'

export default function PayModalFooter({
  rate,
  onConfirm,
  payErrorMessage,
  disabledConfirm,
}: {
  rate: Rate
  onConfirm: () => void
  payErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)

  return (
    <>
      <AutoColumn gap="4px">
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={14} color={theme.text2}>
            Exchange Rate
          </Text>
          <ExchangeRate price={rate?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
        </RowBetween>
      </AutoColumn>
      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-pay-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            Confirm Payment
          </Text>
        </ButtonError>

        {payErrorMessage ? <PayCallbackError error={payErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
