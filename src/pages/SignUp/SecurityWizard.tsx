import React, { useState, useEffect } from 'react'
import { Text } from 'rebass'
import AppBody from '../AppBody'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { SecurityTabs } from '../../components/NavigationTabs'
import { BlueCard } from '../../components/Card'
import { Wrapper, Dots, BottomGrouping } from '../../components/pay/styleds'
import { ButtonLight, ButtonError } from '../../components/Button'
import { Tabs } from '../../components/Tabs'
import { TYPE } from '../../theme'
import PrivateKey from './PrivateKey'
import EmailPassword from './EmailPassword'
import { ApiState } from '../../api'
import { useSetMerchantSecurityCallback } from '../../state/auth/hooks'

function PrivateKeyMessage() {
  return (
    <ColumnCenter>
      <BlueCard>
        <AutoColumn gap="10px">
          <TYPE.link fontWeight={600} color={'white'}>
            Use your private key to login.
          </TYPE.link>
          <TYPE.link fontWeight={400} color={'white'}>
            Choose this option if you don't wish to use an email/password. We recommend copying and saving your private
            key somewhere safe
          </TYPE.link>
          <TYPE.link fontWeight={400} color={'white'}>
            If you lose access to your private key, it may be difficult to recover your account
          </TYPE.link>
        </AutoColumn>
      </BlueCard>
    </ColumnCenter>
  )
}

function EmailPasswordMessage() {
  return (
    <ColumnCenter>
      <BlueCard>
        <AutoColumn gap="10px">
          <TYPE.link fontWeight={600} color={'white'}>
            Choose an email and password to access your account
          </TYPE.link>
          <TYPE.link fontWeight={400} color={'white'}>
            Please provide a real email address that you have access to. This will only be used to send you account
            recovery emails in case you forget your password
          </TYPE.link>
          <TYPE.link fontWeight={400} color={'white'}>
            After that, you can use your email/password to login
          </TYPE.link>
        </AutoColumn>
      </BlueCard>
    </ColumnCenter>
  )
}

export default function SecurityWizard({ history }) {
  const [activeTab, setActiveTab] = useState<string>('email')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { state, success, execute } = useSetMerchantSecurityCallback()

  const handleSubmit = () => {
    if (activeTab === 'key') {
      history.push(`/merchant`)
      return
    }

    execute(email, password)
  }

  useEffect(() => {
    if (success) {
      history.push(`/merchant`)
    }
  }, [success, history])

  return (
    <>
      <AppBody>
        <AutoColumn gap="20px">
          <SecurityTabs />
          <Wrapper id="onboard-page">
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
              {activeTab === 'email' ? <EmailPasswordMessage /> : <PrivateKeyMessage />}
              {activeTab === 'email' ? (
                <EmailPassword
                  email={email}
                  password={password}
                  onChangeEmail={(value) => setEmail(value)}
                  onChangePassword={(value) => setPassword(value)}
                />
              ) : (
                <PrivateKey />
              )}
              <BottomGrouping>
                {state === ApiState.LOADING ? (
                  <ButtonLight disabled>
                    Loading
                    <Dots />
                  </ButtonLight>
                ) : (
                  <ButtonError onClick={handleSubmit} id="signup-button" disabled={false} error={false}>
                    <Text fontSize={16} fontWeight={500}>
                      Save Changes
                    </Text>
                  </ButtonError>
                )}
              </BottomGrouping>
            </AutoColumn>
          </Wrapper>
        </AutoColumn>
      </AppBody>
    </>
  )
}
