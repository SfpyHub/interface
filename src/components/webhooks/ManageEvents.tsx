import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Settings } from 'react-feather'
import { usePopper } from 'react-popper'
import Row, { RowFixed } from '../Row'
import Column, { AutoColumn } from '../Column'
import { ButtonEmpty } from '../Button'
import EventToggle from '../Toggle/EventToggle'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import useTheme from '../../hooks/useTheme'
import { TYPE, LinkStyledButton } from '../../theme'

const Wrapper = styled(Column)`
  width: 100%;
`

const RowWrapper = styled(Row)<{ bgColor: string; active: boolean }>`
  background-color: ${({ bgColor, active, theme }) => (active ? bgColor ?? 'transparent' : theme.bg2)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`

const StyledTitleText = styled.div<{ active: boolean }>`
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

export function EventsRow() {
  const [isActive, setIsActive] = useState(false)
  const listColor = "#38b2c4"
  const theme = useTheme()

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  })

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <RowWrapper active={isActive} bgColor={listColor}>
      <Column style={{ flex: '1' }}>
        <Row>
          <StyledTitleText active={isActive}>payment:created</StyledTitleText>
        </Row>
        <RowFixed mt="4px">
          <StyledDescriptionText active={isActive} mr="6px">Event fired when a payment is made</StyledDescriptionText>
          <StyledMenu ref={node as any}>
            <ButtonEmpty onClick={toggle} ref={setReferenceElement} padding="0">
              <Settings stroke={isActive ? theme.bg1 : theme.text1} size={12} />
            </ButtonEmpty>
            {open && (
              <PopoverContainer show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
                <UnpaddedLinkStyledButton onClick={() => {}} disabled={false}>
                  Send test event
                </UnpaddedLinkStyledButton>
              </PopoverContainer>
            )}
          </StyledMenu>
        </RowFixed>
      </Column>
      <EventToggle
        isActive={isActive}
        bgColor={listColor}
        toggle={() => setIsActive(!isActive)}
      />
    </RowWrapper>

  )
}

const EventsContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`

export function ManageEvents() {
  return (
    <Wrapper>
      <EventsContainer>
        <AutoColumn gap="md">
          <EventsRow />
        </AutoColumn>
      </EventsContainer>
    </Wrapper>
  )
}