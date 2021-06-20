import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Redirect } from 'react-router-dom'
import { InputPanel, Container } from './styleds'
import { FormInput } from './FormInput'
import { useDerivedAuthState } from '../../state/auth/hooks'

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
  const { merchant } = useDerivedAuthState()
  const theme = useContext(ThemeContext)

  if (!merchant) {
    return <Redirect to={`/signup`} />
  }

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
