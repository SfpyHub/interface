import React from 'react'
import { InputPanel, Container } from '../SignUp/styleds'
import { FormInput } from '../SignUp/FormInput'

export default function PrivateKey({
  value,
  error,
  onChange,
}: {
  value?: string
  error?: string
  onChange?: (value: string) => void
}) {
  return (
    <InputPanel id={'private-key'}>
      <Container hideInput={false}>
        <FormInput
          label={'Private key'}
          value={value || ''}
          type={'password'}
          error={error || ''}
          placeholder={'• • • • • • • • • •'}
          onChange={onChange}
        />
      </Container>
    </InputPanel>
  )
}
