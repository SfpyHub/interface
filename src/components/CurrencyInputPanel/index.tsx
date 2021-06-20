import { Currency } from '@sfpy/web3-sdk'
import React, { useContext, useState, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { ApiState } from '../../api'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { StyledText } from '../NumericalText'
import { TYPE } from '../../theme'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import { useCurrencyBalance } from '../../state/wallet/hooks'
import { usePaymentState } from '../../state/pay/hooks'
import { useActiveWeb3React } from '../../hooks/useWeb3'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ disabled, selected }) => (selected || disabled ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, disabled, theme }) =>
      !disabled && (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
  :disabled {
    background-color: transparent;
    color: ${({ theme }) => theme.primaryText1};
    :hover {
      cursor: auto;
      box-shadow: none;
      outline: none;
    }
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stoke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? ' margin: 0 0.25rem 0 0.75rem;' : ' margin: 0 0.25rem 0 0.25rem')};
  font-size: ${({ active }) => (active ? '20px' : '16px')};
`

interface CurrencyInputPanelProps {
  id: string
  label: string
  value: string
  disableCurrencySelect?: boolean
  currency?: Currency | null
  hideInput?: boolean
  hideBalance?: boolean
  onCurrencySelect?: (currency: Currency) => void
}

export default function CurrencyInputPanel({
  id,
  label,
  value,
  onCurrencySelect,
  currency,
  hideInput = false,
  hideBalance = false,
  disableCurrencySelect = false,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const [apiState] = usePaymentState()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        {label && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {account && (
                <TYPE.body
                  onClick={() => {}}
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? 'Balance: ' + selectedCurrencyBalance.toSignificant(6)
                    : ' -'}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow selected={disableCurrencySelect}>
          <StyledText>{value}</StyledText>
          <CurrencySelect
            disabled={apiState === ApiState.LOADING}
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {currency ? <CurrencyLogo currency={currency} size={'24px'} /> : null}
              <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                    '...' +
                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || 'Select a token'}
              </StyledTokenName>
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      <CurrencySearchModal isOpen={modalOpen} onDismiss={handleDismissSearch} onCurrencySelect={onCurrencySelect} />
    </InputPanel>
  )
}
