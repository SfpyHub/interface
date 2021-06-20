import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { InputPanel, Container } from '../SignUp/styleds'
import { FormInput } from '../SignUp/FormInput'

export default function EmailPassword({
  email,
  password,
  onChangeEmail,
  onChangePassword,
}: {
  email: string
  password: string
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
}) {
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={'email-password'}>
      <Container hideInput={false}>
        <FormInput
          label={'Email Address'}
          value={email}
          type={'text'}
          error={''}
          placeholder={'john.doe@example.com'}
          onChange={onChangeEmail}
        />
        <FormInput
          label={'Password'}
          value={password}
          type={'password'}
          error={''}
          placeholder={'• • • • • • • • • •'}
          style={{ borderTop: `1px solid ${theme.bg2}` }}
          onChange={onChangePassword}
        />
      </Container>
    </InputPanel>
  )
}
