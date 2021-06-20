import React, { useState, useEffect } from 'react'
import { Text } from 'rebass'
import AppBody from '../AppBody'
import { Wrapper, Dots, BottomGrouping } from '../../components/pay/styleds'
import { ForgotPasswordTabs } from '../../components/NavigationTabs'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Tabs } from '../../components/Tabs'
import { ButtonError, ButtonLight } from '../../components/Button'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import Modal from '../../components/Modal'
import EmailAddress from './Email'
import { StyledInternalLink } from '../../theme'
import { ApiState } from '../../api'
import {
  useRequestPasswordResetCallback
} from '../../state/auth/hooks'

export default function ForgotPassword({ history }) {
  const [email, setEmail] = useState<string>('')
  const {
    state,
    isOpen,
    setIsOpen,
    execute
  } = useRequestPasswordResetCallback()

  const handleSubmit = () => {
    execute(email)
  }

  const isValid = email.length > 0

  return (
    <>
      <AppBody>
        <ForgotPasswordTabs />
        <Wrapper id="forgot-password-page">
          <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
            <ForgotPasswordModal setShowForgotPasswordModal={setIsOpen} />
          </Modal>
          <AutoColumn gap="20px">
            <EmailAddress 
              value={email}
              onChange={(v) => setEmail(v)}
            />
            <BottomGrouping>
              {state === ApiState.LOADING ? (
                <ButtonLight disabled>
                  Loading
                  <Dots />
                </ButtonLight>
              ) : (
                <ButtonError onClick={handleSubmit} id="login-button" disabled={!isValid} error={false}>
                  <Text fontSize={16} fontWeight={500}>
                    Submit
                  </Text>
                </ButtonError>
              )}
            </BottomGrouping>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
