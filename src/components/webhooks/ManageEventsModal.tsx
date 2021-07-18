import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AutoRow } from '../Row'
import { ButtonError, ButtonLight } from '../Button'
import { Text } from 'rebass'
import Modal from '../Modal'
import { ModalPopup } from '../Popups'
import { Dots } from '../pay/styleds'
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
import { EventType, Subscription } from '../../order'

export const StyledWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 1rem;
`

export function ManageEventsModal({ 
  subscription, 
  events,
  loading,
  onSubmit
}: { 
  subscription: Subscription, 
  events: EventType[],
  loading: boolean
  onSubmit: (toAdd: string[], toRemove: string[]) => void
}) {
  const [eventsToAdd, setEventsToAdd] = useState<EventType[]>([])
  const [eventsToRemove, setEventsToRemove] = useState<EventType[]>([])

  const eventsModalOpen = useModalOpen(ApplicationModal.EVENTS)
  const toggleEventsModal = useToggleEventsModal()

  function contains(events: EventType[], event: EventType): boolean {
    return events.some(e => e.name === event.name)
  }

  function filter(events: EventType[], event: EventType): EventType[] {
    return events.filter(e => e.name !== event.name)
  }

  function handleEventToggle(event: EventType, active: boolean) {
    if (subscription.isSubscribed(event)) {
      if (!active) {
        if (!contains(eventsToRemove, event)) {
          setEventsToRemove([...eventsToRemove, event])
        } else {
          setEventsToRemove(filter(eventsToRemove, event))
        }
      } else {
        if (contains(eventsToRemove, event)) {
          setEventsToRemove(filter(eventsToRemove, event))
        }
      }
    } else if (!subscription.isSubscribed(event)) {
      if (active) {
        if (!contains(eventsToAdd, event)) {
          setEventsToAdd([...eventsToAdd, event])
        } else {
          setEventsToAdd(filter(eventsToAdd, event))
        }
      } else {
        if (contains(eventsToAdd, event)) {
          setEventsToAdd(filter(eventsToAdd, event))
        }
      }
    }
  }

  function handleSubmit() {
    const toAdd = eventsToAdd.map(e => e.name)
    const toRemove = eventsToRemove.map(e => e.name)
    
    onSubmit(toAdd, toRemove)
  }

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleEventsModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Manage Events</HoverText>
        </HeaderRow>
        <StyledWrapper>
          <ModalPopup />
          <ManageEvents 
            onToggleEvent={handleEventToggle}
            subscription={subscription} 
            events={events} 
          />
        </StyledWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={eventsModalOpen} onDismiss={toggleEventsModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
        <AutoRow padding="12px">
          {loading ? (
            <ButtonLight disabled>
              Loading
              <Dots />
            </ButtonLight>  
          ) : (
            <ButtonError onClick={handleSubmit} disabled={loading} id="confirm-save-endpoint">
              <Text fontSize={20} fontWeight={500}>
              {'Save'}
              </Text>
            </ButtonError>
          )}
        </AutoRow>
      </Wrapper>
    </Modal>
  )
}