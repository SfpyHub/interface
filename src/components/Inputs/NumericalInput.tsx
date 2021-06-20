import React, { KeyboardEvent, useRef, useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '24px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export const Input = React.memo(function InnerInput({
  value,
  title,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  title?: string
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    onUserInput(nextUserInput.replace(/[-.]/g, ''))
  }

  const [focused, setFocused] = useState<boolean>(false)

  const inputRef = useRef(null)

  const preventArrowKeys = (event: KeyboardEvent) => {
    if (event.keyCode === 37 || event.keyCode === 39) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    if (focused) {
      // Moving cursor to the end
      inputRef.current.selectionStart = inputRef.current.value.length
      inputRef.current.selectionEnd = inputRef.current.value.length
    }
  }, [focused])

  return (
    <StyledInput
      {...rest}
      ref={inputRef}
      value={value}
      onChange={(event) => {
        // replace commas with periods,
        // because safepay exclusively uses
        // period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      onKeyDown={preventArrowKeys}
      onClick={() => setFocused(true)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      // universal input options
      inputMode="decimal"
      title={title ?? ''}
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  )
})

export default Input
