import React, { useContext, useState, useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleLinksModal } from '../../state/application/hooks'
import { X, Twitter, Instagram, ExternalLink } from 'react-feather'
import { AutoRow } from '../Row'
import { ButtonError } from '../Button'

import Modal from '../Modal'
import Option from './Option'

const SUPPORTED_LINKS = {
  WEBSITE: {
    header: 'Add a link to your website',
    subHeader: 'Adding a link here will allow users to visit your website',
    placeholder: 'https://www.yourwebsite.com',
    Icon: ExternalLink,
  },
  INSTAGRAM: {
    header: 'Add a link to your Instagram page',
    subHeader: 'Optionally link users to your Instagram page',
    placeholder: 'http://instagram.com/yourusername',
    Icon: Instagram,
  },
  TWITTER: {
    header: 'Add a link to your Twitter account',
    subHeader: 'Optionally link users to your Twitter account',
    placeholder: 'https://twitter.com/yourhandle',
    Icon: Twitter,
  },
}

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
  color: ${({ theme }) => theme.text4};
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

export function AdditionalLinksModal({
  onUpdateLinks,
  savedWebsiteURL,
  savedInstagramURL,
  savedTwitterURL,
}: {
  onUpdateLinks: (w: string, i: string, t: string) => void
  savedWebsiteURL: string
  savedInstagramURL: string
  savedTwitterURL: string
}) {
  const theme = useContext(ThemeContext)
  const linksModalOpen = useModalOpen(ApplicationModal.LINKS)
  const toggleLinksModal = useToggleLinksModal()

  const [websiteUrl, setWebsiteUrl] = useState<string>('')
  useEffect(() => setWebsiteUrl(savedWebsiteURL), [savedWebsiteURL])

  const [instagramUrl, setInstagramUrl] = useState<string>(savedInstagramURL)
  useEffect(() => setInstagramUrl(savedInstagramURL), [savedInstagramURL])

  const [twitterUrl, setTwitterUrl] = useState<string>(savedTwitterURL)
  useEffect(() => setTwitterUrl(savedTwitterURL), [savedTwitterURL])

  function areLinksDifferent(oldValue: string, newValue: string): boolean {
    return oldValue !== newValue
  }

  function onClickSave() {
    onUpdateLinks(
      areLinksDifferent(savedWebsiteURL, websiteUrl) ? websiteUrl : savedWebsiteURL,
      areLinksDifferent(savedInstagramURL, instagramUrl) ? instagramUrl : savedInstagramURL,
      areLinksDifferent(savedTwitterURL, twitterUrl) ? twitterUrl : savedTwitterURL
    )
  }

  function setURL(field: string, value: string) {
    switch (field) {
      case 'WEBSITE':
        setWebsiteUrl(value)
        break
      case 'INSTAGRAM':
        setInstagramUrl(value)
        break
      case 'TWITTER':
        setTwitterUrl(value)
        break
      default:
        break
    }
  }

  function getURL(field: string): string {
    switch (field) {
      case 'WEBSITE':
        return websiteUrl
      case 'INSTAGRAM':
        return instagramUrl
      case 'TWITTER':
        return twitterUrl
      default:
        return ''
    }
  }

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
          value={getURL(key)}
          onChange={setURL}
          Icon={<Icon size={20} />}
        />
      )
    })
  }

  function getModalContent() {
    return (
      <UpperSection>
        <CloseIcon onClick={toggleLinksModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <HoverText>Update social links</HoverText>
        </HeaderRow>
        <ContentWrapper>
          <OptionGrid>{getOptions()}</OptionGrid>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={linksModalOpen} onDismiss={toggleLinksModal} minHeight={false} maxHeight={false}>
      <Wrapper>
        {getModalContent()}
        <AutoRow padding="12px">
          <ButtonError onClick={onClickSave} disabled={false} id="confirm-save-links">
            <Text fontSize={20} fontWeight={500}>
              Save
            </Text>
          </ButtonError>
        </AutoRow>
      </Wrapper>
    </Modal>
  )
}
