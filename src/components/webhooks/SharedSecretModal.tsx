import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSharedSecretModal } from '../../state/application/hooks'
import { CustomLightSpinner } from '../../theme/components'
import { ColumnCenter } from '../Column'
import { SharedSecretComponent } from './SharedSecret'
import Modal from '../Modal'
import { ApiState } from '../../api'
import { AppDispatch } from '../../state'
import { setSharedSecret } from '../../state/secretkey/actions'
import Circle from '../../assets/images/blue-loader.svg'
import {
  useSharedSecretResponse,
  useUpdateSharedSecretCallback,
  useSharedSecretApiState
} from '../../state/secretkey/hooks'

import {
  Wrapper,
  ContentWrapper,
  UpperSection,
  HeaderRow,
  HoverText,
  CloseIcon,
  CloseColor
} from './CreateEndpointModal'
import { SharedSecret, SharedSecretProps } from '../../order'

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 18px 0;
`

export function SharedSecretModal() {
  const [secret, setSecret] = useState<SharedSecret>(undefined)
  const dispatch = useDispatch<AppDispatch>()
  const secretModalOpen = useModalOpen(ApplicationModal.SHAREDSECRET)
  const toggleSecretModal = useToggleSharedSecretModal()

  const state = useSharedSecretApiState()
  const secretkey = useSharedSecretResponse()
  const { 
    state: updateState, 
    data: updateData, 
    execute 
  } = useUpdateSharedSecretCallback()

  const isLoading = state === ApiState.LOADING || updateState === ApiState.LOADING

  useEffect(() => {
    if (updateData) {
      dispatch(setSharedSecret({ secret: updateData }))
      const secret = new SharedSecret(updateData as SharedSecretProps)
      setSecret(secret)
    }
  }, [updateData, dispatch])

  useEffect(() => {
    setSecret(secretkey)
  }, [secretkey])

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleSecretModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Webhook Shared Secret</HoverText>
        </HeaderRow>
        <ContentWrapper>
          {isLoading ? (
            <ConfirmedIcon>
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            </ConfirmedIcon>  
          ) : (
            <SharedSecretComponent 
              secret={secret} 
              isLoading={isLoading}
              onClickRotate={execute}
            />
          )}
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={secretModalOpen} onDismiss={toggleSecretModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
      </Wrapper>
    </Modal>
  )
}