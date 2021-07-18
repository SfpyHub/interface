import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleDeleteSubscriptionModal } from '../../state/application/hooks'
import { Dots } from '../pay/styleds'
import { X } from 'react-feather'
import { AutoRow } from '../Row'
import { ButtonError, ButtonLight } from '../Button'
import { ModalPopup } from '../Popups'

import Modal from '../Modal'

export const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export const CloseColor = styled(X)`
  color: ${({ theme }) => theme.text4};
`

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  margin: 0;
  padding: 0;
  width: 100%;
`

export const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

export const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
		padding: 1rem;
	`}
`

export const UpperSection = styled.div`
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

export const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

export function DeleteSubscriptionModal({
  loading,
  onClickDelete
}: {
  loading: boolean
  onClickDelete: () => void
}) {
  const theme = useContext(ThemeContext)
  const subscriptionModalOpen = useModalOpen(ApplicationModal.DEL_SUBSCRIPTION)
  const toggleSubscriptionModal = useToggleDeleteSubscriptionModal() 

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleSubscriptionModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Delete Subscription</HoverText>
        </HeaderRow>
        <ContentWrapper>
          <ModalPopup />
          <Text textAlign="center" fontSize={20} fontWeight={500}>
            Are you sure you want to delete this endpoint?
          </Text>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={subscriptionModalOpen} onDismiss={toggleSubscriptionModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
        <AutoRow padding="12px">
        {loading ? (
          <ButtonLight disabled>
            Loading
            <Dots />
          </ButtonLight>  
        ) : (
          <ButtonError error={true} onClick={onClickDelete} id="confirm-delete-endpoint">
            <Text fontSize={20} fontWeight={500}>
              Delete
            </Text>
          </ButtonError>
        )}
        </AutoRow>
      </Wrapper>
    </Modal>
  )
}