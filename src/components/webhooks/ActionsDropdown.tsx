import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { usePopper } from 'react-popper'
import { ChevronDown } from 'react-feather'
import { ButtonSecondary, ButtonOutlined, ButtonError } from '../Button'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import {
  PopoverContainer,
  StyledMenu
} from './ManageEvents'

const ResponseButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  justify-self: flex-end;
  padding: 4px 8px;
`

const RightMenu = styled(StyledMenu)`
  justify-content: flex-end;
`

const StyledPopoverContainer = styled(PopoverContainer)`
  flex-direction: column !important;
  padding: 0.5rem;
`

const StyledButtonPrimary = styled(ButtonOutlined)`
  padding: 4px;
  border-radius: 4px;
`

const StyledButtonError = styled(ButtonError)`
  padding: 4px;
  border-radius: 4px;
`

export function ActionsDropdown({
  onClickDetails
}: {
  onClickDetails: () => void
}) {

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  })

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <RightMenu ref={node as any}>
      <ResponseButtonSecondary onClick={toggle} ref={setReferenceElement} padding="0">
        Actions <ChevronDown size={12} />
      </ResponseButtonSecondary>
      {open && (
        <StyledPopoverContainer show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
          <StyledButtonPrimary onClick={onClickDetails} disabled={false}>
            Details
          </StyledButtonPrimary>
          <StyledButtonPrimary onClick={() => {}} disabled={false}>
            Update
          </StyledButtonPrimary>
          <StyledButtonError error={true}>
            Delete
          </StyledButtonError>
        </StyledPopoverContainer>
      )}
    </RightMenu>
  )
}