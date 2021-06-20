import React from 'react'
import { InputPanel, Container } from '../SignUp/styleds'
import { FormInput } from '../SignUp/FormInput'

export default function EmailAddress({
  value,
  error,
  onChange,
}: {
  value?: string
  error?: string
  onChange?: (value: string) => void
}) {
  return (
    <InputPanel id={'email-address'}>
      <Container hideInput={false}>
        <FormInput
          label={'Email Address'}
          value={value || ''}
          type={'text'}
          error={error || ''}
          placeholder={'jonn.doe@example.com'}
          onChange={onChange}
        />
      </Container>
    </InputPanel>
  )
}
