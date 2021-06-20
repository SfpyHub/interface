import React, { useState, useEffect } from 'react'
import { Text } from 'rebass'
import AppBody from '../AppBody'
import { Wrapper, Dots, BottomGrouping } from '../../components/pay/styleds'
import { ConfirmPasswordTabs } from '../../components/NavigationTabs'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { Tabs } from '../../components/Tabs'
import { ButtonError, ButtonLight } from '../../components/Button'
import { ConfirmPasswordModal } from './ConfirmPasswordModal'
import Modal from '../../components/Modal'
import Password from './Password'
import { StyledInternalLink } from '../../theme'
import { ApiState } from '../../api'
import { useConfirmPasswordResetCallback } from '../../state/auth/hooks'

export default function ConfirmPassword({ history }) {
  const [password, setPassword] = useState<string>('')
  const {
    state,
    isOpen,
    setIsOpen,
    execute,
    inputError
  } = useConfirmPasswordResetCallback()
  
  const isValid = !inputError && password.length

  const handleSubmit = () => {
    execute(password)
  }

  const handleRouteToLogin = () => {
    setIsOpen(false)
    history.replace({ pathname: '/login', search: ''})
  }

  return (
    <>
      <AppBody>
        <Modal isOpen={isOpen} onDismiss={handleRouteToLogin}>
          <ConfirmPasswordModal />
        </Modal>
        <ConfirmPasswordTabs />
        <Wrapper id="confirm-password-page">
          <AutoColumn gap="20px">
            <Password 
              value={password}
              onChange={(v) => setPassword(v)}
            />
            <BottomGrouping>
              {state === ApiState.LOADING ? (
                <ButtonLight disabled>
                  Loading
                  <Dots />
                </ButtonLight>
              ) : (
                <ButtonError onClick={handleSubmit} id="confirm-button" disabled={!isValid} error={false}>
                  <Text fontSize={16} fontWeight={500}>
                    {inputError ? inputError : 'Confirm'}
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
