import { CurrencyAmount } from '@sfpy/web3-sdk'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText } from './styleds'

export default function PayModalHeader({ inputAmount }: { inputAmount: CurrencyAmount }) {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={inputAmount.currency} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme.primary1}>
            {inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
    </AutoColumn>
  )
}
