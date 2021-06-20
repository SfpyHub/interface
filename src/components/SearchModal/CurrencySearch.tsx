import { Currency, ETHER, Token } from '@sfpy/web3-sdk'
import React, { KeyboardEvent, RefObject, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme'
import { useAllTokens, useToken } from '../../hooks/useTokens'
import { isAddress } from '../../utils'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { useTokenComparator } from './sorting'
import { filterTokens } from './filtering'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currrency: Currency) => void
}

export function CurrencySearch({ isOpen, onDismiss, selectedCurrency, onCurrencySelect }: CurrencySearchProps) {
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currrency: Currency) => {
      onCurrencySelect(currrency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  // manage focus on open
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
            <QuestionHelper text="Choose a token from this list to make the payment." />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          placeholder="Search by name or paste an address"
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            Token Name
          </Text>
        </RowBetween>
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={showETH}
              currencies={filteredSortedTokens}
              selectedCurrency={selectedCurrency}
              onCurrencySelect={handleCurrencySelect}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
    </Column>
  )
}
