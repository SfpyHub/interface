import React, { CSSProperties } from 'react'
import { PaddedColumn, Input, Label, ErrorLabel } from './styleds'

interface InputProps {
  label: string
  value: string
  type: string
  placeholder?: string
  error?: string
  style?: CSSProperties
  onChange?: (value: string) => void
}

export function FormInput({ label, value, type, error, placeholder, style = {}, onChange }: InputProps) {
  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    onChange(value)
  }

  return (
    <PaddedColumn style={style}>
      {label && <Label>{label}</Label>}
      <Input type={type} value={value} placeholder={placeholder} onChange={onChangeInput} />
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </PaddedColumn>
  )
}
