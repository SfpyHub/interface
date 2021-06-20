import { Currency, CurrencyAmount, currencyEquals } from '@sfpy/web3-sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { MenuItem } from './styleds'
import Loader from '../Loader'

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, currency)
  return (
    <MenuItem style={style} onClick={() => (isSelected ? null : onSelect())} disabled={isSelected}>
      <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.symbol}
        </Text>
      </Column>
      <span />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  onCurrencySelect,
  selectedCurrency,
  fixedListRef,
  showETH,
}: {
  height: number
  currencies: Currency[]
  onCurrencySelect: (currency: Currency) => void
  selectedCurrency?: Currency | null
  fixedListRef: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
}) {
  const itemData = useMemo(() => (showETH ? [Currency.ETHER, ...currencies] : currencies), [showETH, currencies])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const handleSelect = () => onCurrencySelect(currency)
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      return <CurrencyRow style={style} currency={currency} isSelected={isSelected} onSelect={handleSelect} />
    },
    [onCurrencySelect, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => index, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
