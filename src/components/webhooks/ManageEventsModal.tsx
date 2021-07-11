import React from 'react'
import styled from 'styled-components'
import { PaddedColumn, Separator } from './styled'
import { RowBetween, AutoRow } from '../Row'
import { ButtonError } from '../Button'
import { X } from 'react-feather'
import { Text } from 'rebass'
import Modal from '../Modal'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleEventsModal } from '../../state/application/hooks'
import { ManageEvents } from './ManageEvents'
import {
  Wrapper,
  UpperSection,
  HeaderRow,
  HoverText,
  CloseIcon,
  CloseColor
} from './CreateEndpointModal'

export function ManageEventsModal() {
  
  const eventsModalOpen = useModalOpen(ApplicationModal.EVENTS)
  const toggleEventsModal = useToggleEventsModal()

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleEventsModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Manage Events</HoverText>
        </HeaderRow>
        <ManageEvents />
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={eventsModalOpen} onDismiss={toggleEventsModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
        <AutoRow padding="12px">
          <ButtonError onClick={() => {}} disabled={false} id="confirm-save-endpoint">
            <Text fontSize={20} fontWeight={500}>
              Save
            </Text>
          </ButtonError>
        </AutoRow>
      </Wrapper>
    </Modal>
  )
}