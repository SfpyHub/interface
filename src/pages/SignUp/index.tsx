import React, { useState, useEffect } from 'react'
import { Text } from 'rebass'
import AppBody from '../AppBody'
import { Wrapper } from './styleds'
import { SignupTabs } from '../../components/NavigationTabs'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { BlueCard } from '../../components/Card'
import { ButtonLight, ButtonError } from '../../components/Button'
import { Dots, BottomGrouping } from '../../components/pay/styleds'
import { Container } from './styleds'
import { FormInput } from './FormInput'
import { TYPE, StyledInternalLink } from '../../theme'
import { ApiState } from '../../api'
import { useRegisterMerchantCallback, useDerivedAuthState } from '../../state/auth/hooks'

const error = 'Enter a valid name'
export default function Signup({ history }) {
  const [name, setName] = useState<string>('')
  const { state, execute } = useRegisterMerchantCallback()
  const { merchant, apikey } = useDerivedAuthState()

  const handleSubmit = () => {
    execute(name)
  }

  useEffect(() => {
    if (merchant && apikey) {
      history.push(`/on-board`)
    }
  }, [merchant, apikey, history])

  return (
    <>
      <AppBody>
        <SignupTabs />
        <Wrapper id="signup-page">
          <AutoColumn gap="20px">
            <ColumnCenter>
              <BlueCard>
                <AutoColumn gap="10px">
                  <TYPE.link fontWeight={600} color={'white'}>
                    Get started by entering your business name.
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'white'}>
                    Once your account is created we'll ask how you'd like to secure it in the next step
                  </TYPE.link>
                  <TYPE.link fontWeight={400} color={'white'}>
                    After that, you can add more details and update your account
                  </TYPE.link>
                </AutoColumn>
              </BlueCard>
            </ColumnCenter>
            <Container hideInput={false}>
              <FormInput
                label={'Enter your business name'}
                value={name}
                type={'text'}
                error={name === '' ? error : ''}
                placeholder={'E.g Acme, Inc.'}
                onChange={(name) => setName(name)}
              />
            </Container>
            <BottomGrouping>
              {state === ApiState.LOADING ? (
                <ButtonLight disabled>
                  Loading
                  <Dots />
                </ButtonLight>
              ) : (
                <ButtonError onClick={handleSubmit} id="signup-button" disabled={name === ''} error={false}>
                  <Text fontSize={16} fontWeight={500}>
                    Create Account
                  </Text>
                </ButtonError>
              )}
              <RowBetween padding="1rem">
                <StyledInternalLink to="/login">Have an account?</StyledInternalLink>
              </RowBetween>
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
