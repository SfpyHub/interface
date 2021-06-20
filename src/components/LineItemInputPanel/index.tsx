import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Trash2 as Delete } from 'react-feather'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../Inputs/NumericalInput'
import { SUPPORTED_ENTITIES, EntityInfo } from '../../order'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const InputSelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, disabled, theme }) =>
    !disabled && (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ disabled, selected }) => (selected || disabled ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :disabled {
    opacity: 0.4;
    background-color: ${({ theme }) => theme.primary5};
    color: ${({ theme }) => theme.primaryText1};
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      outline: none;
    }
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledInputName = styled.span`
  margin: 0 0.25rem 0 0.25rem;
  font-size: 16px;
`

const StyledDeleteIcon = styled(Delete)<{ disabled?: boolean }>`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme, disabled }) => (disabled ? theme.text1 : theme.red1)};
  }
`

const StyledDeleteButton = styled.button`
  height: 28px;
  border: 0px;
  background-color: transparent;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-left: 0.5rem;
  :hover {
    background-color: ${({ theme }) => theme.red1};
    > svg > * {
      stroke: ${({ theme }) => theme.white};
    }
  }
  :focus {
    background-color: ${({ theme }) => theme.red1};
    outline: none;
    > svg > * {
      stroke: ${({ theme }) => theme.white};
    }
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 0.5rem;
  `};
`

interface LineItemInputPanelProps {
  value: string
  amount: string
  onDeleteInput: (key: string) => void
  onUserInput: (key: string, value: string) => void
  hideDeleteButton: boolean
  disableInputSelect?: boolean
  disableUserInput?: boolean
  id: string
}

export default function LineItemInputPanel({
  value,
  amount,
  onUserInput,
  onDeleteInput,
  hideDeleteButton,
  disableInputSelect,
  disableUserInput,
  id,
}: LineItemInputPanelProps) {
  const hideInput = false
  const entity: EntityInfo | undefined = SUPPORTED_ENTITIES[value]

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableInputSelect}>
          <RowBetween>
            <InputSelect selected={true} className="open-input-type-select-button">
              <Aligner>
                <StyledInputName className="token-symbol-container">{entity.name}</StyledInputName>
              </Aligner>
            </InputSelect>
            {!hideDeleteButton && (
              <StyledDeleteButton onClick={() => onDeleteInput(value)}>
                <StyledDeleteIcon />
              </StyledDeleteButton>
            )}
            <NumericalInput
              align={'right'}
              className="line-item-amount-input"
              value={amount}
              onUserInput={(val) => {
                onUserInput(value, val)
              }}
            />
          </RowBetween>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
