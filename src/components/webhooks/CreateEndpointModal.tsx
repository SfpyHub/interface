import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleEndpointsModal } from '../../state/application/hooks'
import { Dots } from '../pay/styleds'
import { X } from 'react-feather'
import { AutoRow } from '../Row'
import { ButtonError, ButtonLight } from '../Button'
import { ModalPopup } from '../Popups'

import Modal from '../Modal'
import Option from '../EditMerchant/Option'

const SUPPORTED_LINKS = {
  ENDPOINT: {
    header: 'Add an api endpoint that lives on your server',
    subHeader: 'Events that you\'re interested in will be POSTed to this endpoint',
    placeholder: 'Endpoint (https://...)'
  }
}

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

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
		grid-template-columns: 1fr;
		grid-gap: 10px;
	`}
`

export const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

export function CreateEndpointModal({
  value,
  loading,
  inputError,
  onChangeEndpoint,
  onClickSave
}: {
  value: string,
  inputError?: string
  loading: boolean
  onClickSave: () => void
  onChangeEndpoint: (field: string, value: string) => void
}) {
  const theme = useContext(ThemeContext)
  const endpointsModalOpen = useModalOpen(ApplicationModal.ENDPOINT)
  const toggleEndpointsModal = useToggleEndpointsModal() 
  
  function getOptions() {
    return Object.keys(SUPPORTED_LINKS).map((key) => {
      const option = SUPPORTED_LINKS[key]
      const Icon = option.Icon
      return (
        <Option
          id={`insert-${key}`}
          key={key}
          field={key}
          color={theme.text1}
          header={option.header}
          subheader={option.subHeader}
          placeholder={option.placeholder}
          value={value}
          onChange={onChangeEndpoint}
          Icon={null}
        />
      )
    })
  }

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleEndpointsModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>New Webhook Subscription</HoverText>
        </HeaderRow>
        <ContentWrapper>
          <ModalPopup />
          <OptionGrid>{getOptions()}</OptionGrid>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={endpointsModalOpen} onDismiss={toggleEndpointsModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
        <AutoRow padding="12px">
        {loading ? (
          <ButtonLight disabled>
            Loading
            <Dots />
          </ButtonLight>  
        ) : (
          <ButtonError onClick={onClickSave} disabled={!!inputError} id="confirm-save-endpoint">
            <Text fontSize={20} fontWeight={500}>
            {inputError ? inputError : 'Save'}
            </Text>
          </ButtonError>
        )}
        </AutoRow>
      </Wrapper>
    </Modal>
  )
}