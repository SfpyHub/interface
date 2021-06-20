import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleLineItemModal } from '../../state/application/hooks'
import { X } from 'react-feather'

import Modal from '../Modal'
import Option from './Option'
import { SUPPORTED_ENTITIES } from '../../order'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(X)`
  color: ${({ theme }) => theme.text1};
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
		padding: 1rem;
	`}
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
		grid-template-columns: 1fr;
		grid-gap: 10px;
	`}
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

export default function LineItemModal({ onSelectLineItem }: { onSelectLineItem: (field: string) => void }) {
  const theme = useContext(ThemeContext)

  const lineItemModalOpen = useModalOpen(ApplicationModal.LINEITEM)
  const toggleLineItemModal = useToggleLineItemModal()

  function getOptions() {
    return Object.keys(SUPPORTED_ENTITIES).map((key) => {
      const option = SUPPORTED_ENTITIES[key]

      return (
        <Option
          id={`insert-${key}`}
          onClick={() => onSelectLineItem(key)}
          key={key}
          active={false}
          color={theme.text1}
          header={option.name}
          subheader={option.description}
          icon={option.iconName}
        />
      )
    })
  }

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleLineItemModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Add a line item</HoverText>
        </HeaderRow>
        <ContentWrapper>
          <OptionGrid>{getOptions()}</OptionGrid>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={lineItemModalOpen} onDismiss={toggleLineItemModal} minHeight={false} maxHeight={false}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
