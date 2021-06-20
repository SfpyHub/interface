import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { DetailsInput, EditIcon } from '../../components/EditMerchant/styled'
import { TYPE } from '../../theme'

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

interface FormInputProps {
  id: string
  label: string
  value: string
  placeholder?: string
  error?: string
  onChange?: (value: string) => void
}

export default function FormInputPanel({ id, label, value, error, placeholder, onChange }: FormInputProps) {
  const theme = useContext(ThemeContext)

  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    onChange(value)
  }

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        {label && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              {error && (
                <TYPE.body
                  onClick={() => {}}
                  color={theme.red1}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline' }}
                >
                  {error}
                </TYPE.body>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <RowBetween padding="0.75rem 0.75rem 0.75rem 1rem">
          <DetailsInput value={value} placeholder={placeholder} onChange={onChangeInput} />
          <EditIcon size={18} />
        </RowBetween>
      </Container>
    </InputPanel>
  )
}
