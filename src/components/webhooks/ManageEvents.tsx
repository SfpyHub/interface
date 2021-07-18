import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Settings } from 'react-feather'
import { usePopper } from 'react-popper'
import { EventType, Subscription } from '../../order'
import Row, { RowFixed } from '../Row'
import Column, { AutoColumn } from '../Column'
import { ButtonEmpty } from '../Button'
import EventToggle from '../Toggle/EventToggle'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import useTheme from '../../hooks/useTheme'
import { TYPE, LinkStyledButton } from '../../theme'
import { useTestEventCallback } from '../../state/events/hooks'
import { ApiState } from '../../api'

const Wrapper = styled(Column)`
  width: 100%;
`

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  background-color: ${({ bgColor, active, theme }) => (active ? bgColor ?? 'transparent' : theme.bg1)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`

const StyledTitleText = styled(TYPE.main)<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const StyledDescriptionText = styled(TYPE.main)<{ active: boolean }>`
  font-size: 12px;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

export const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`

export const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

export const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

export function EventsRow({ active, event, onToggleEvent }: { 
  active: boolean, 
  event: EventType,
  onToggleEvent: (event: EventType, active: boolean) => void
}) {
  const listColor = "#38b2c4"
  const theme = useTheme()

  const [isActive, setIsActive] = useState<boolean>(active)
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { state, execute: fireTestEvent } = useTestEventCallback()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  })

  useOnClickOutside(node, open ? toggle : undefined)

  function onClickTestEvent() {
    fireTestEvent(event.name)
  }

  function onToggle() {
    setIsActive(!isActive)
  }

  useEffect(() => {
    onToggleEvent(event, isActive)
  }, [event, isActive])

  return (
    <RowWrapper active={isActive} bgColor={listColor}>
      <Column style={{ flex: '1' }}>
        <Row>
          <StyledTitleText active={isActive} mr="12px">
            { event.name }
          </StyledTitleText>
          <StyledMenu ref={node as any}>
            <ButtonEmpty onClick={toggle} ref={setReferenceElement} padding="0">
              <Settings stroke={isActive  ? theme.bg1 : theme.text1} size={16} />
            </ButtonEmpty>
            {open && (
              <PopoverContainer show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
                <UnpaddedLinkStyledButton onClick={onClickTestEvent} disabled={state === ApiState.LOADING}>
                  Send test event
                </UnpaddedLinkStyledButton>
              </PopoverContainer>
            )}
          </StyledMenu>
        </Row>
        <RowFixed mt="4px">
          <StyledDescriptionText active={isActive}>
            { event.description }
          </StyledDescriptionText>
        </RowFixed>
      </Column>
      <EventToggle
        isActive={isActive}
        bgColor={listColor}
        toggle={onToggle}
      />
    </RowWrapper>

  )
}

const EventsContainer = styled.div`
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`

export function ManageEvents({ subscription, events, onToggleEvent }: { 
  subscription?: Subscription, 
  events: EventType[],
  onToggleEvent: (event: EventType, active: boolean) => void
}) {
  return (
    <Wrapper>
      <EventsContainer>
        <AutoColumn gap="md">
          {events.map((e, i) => {
            return <EventsRow 
              key={i} 
              event={e}
              onToggleEvent={onToggleEvent}
              active={subscription ? subscription.isSubscribed(e) : false} 
            />
          })}
        </AutoColumn>
      </EventsContainer>
    </Wrapper>
  )
}