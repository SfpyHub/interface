import React, { useState, useEffect } from 'react'
import { Text } from 'rebass'
import AppBody from '../AppBody'
import { Wrapper, Dots, BottomGrouping } from '../../components/pay/styleds'
import { LoginTabs } from '../../components/NavigationTabs'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Tabs } from '../../components/Tabs'
import { ButtonError, ButtonLight } from '../../components/Button'
import { StyledInternalLink } from '../../theme'
import PrivateKey from './PrivateKey'
import EmailPassword from './EmailPassword'
import { ApiState } from '../../api'
import {
  useLoginWithEmailPasswordCallback,
  useLoginMerchantCallback,
  useDerivedAuthState,
} from '../../state/auth/hooks'

export default function Login({ history }) {
  const [activeTab, setActiveTab] = useState<string>('email')
  const [pvtKey, setPvtKey] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { state, execute } = useLoginMerchantCallback()
  const { state: epState, execute: epExecute } = useLoginWithEmailPasswordCallback()
  const { merchant, apikey } = useDerivedAuthState()

  const handleSubmit = () => {
    if (activeTab === 'email') {
      epExecute(email, password)
    } else if (activeTab === 'key') {
      execute(pvtKey)
    }
  }

  useEffect(() => {
    if (merchant && apikey) {
      history.push(`/create`)
    }
  }, [merchant, apikey, history])

  const isDisabled =
    (activeTab === 'key' && pvtKey === '') || (activeTab === 'email' && (email === '' || password === ''))

  return (
    <>
      <AppBody>
        <LoginTabs />
        <Wrapper id="login-page">
          <AutoColumn gap="20px">
            <Tabs
              styles={{
                padding: '0px',
              }}
              tabs={[
                {
                  title: 'Email/Password',
                  key: 'email',
                },
                {
                  title: 'Private Key',
                  key: 'key',
                },
              ]}
              active={activeTab}
              onClick={(key) => setActiveTab(key)}
            />
            {activeTab === 'email' ? (
              <EmailPassword
                email={email}
                password={password}
                onChangeEmail={(value) => setEmail(value)}
                onChangePassword={(value) => setPassword(value)}
              />
            ) : (
              <PrivateKey value={pvtKey} onChange={(value) => setPvtKey(value)} />
            )}
            <BottomGrouping>
              {state === ApiState.LOADING || epState === ApiState.LOADING ? (
                <ButtonLight disabled>
                  Loading
                  <Dots />
                </ButtonLight>
              ) : (
                <ButtonError onClick={handleSubmit} id="login-button" disabled={isDisabled} error={false}>
                  <Text fontSize={16} fontWeight={500}>
                    Sign in
                  </Text>
                </ButtonError>
              )}
              <RowBetween padding="1rem">
                <StyledInternalLink to="/signup">Need an account?</StyledInternalLink>
                {activeTab === 'email' && <StyledInternalLink to="/forgot-password">Forgot your password?</StyledInternalLink>}
              </RowBetween>
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
