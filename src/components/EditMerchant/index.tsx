import React, { useState, useEffect } from 'react'
import { AutoColumn } from '../Column'
import Row, { RowBetween } from '../Row'
import Loader from '../Loader'
import AddButton from './AddButton'
import { LineLoader } from '../Loader'
import InfoButton, { ButtonWrapper } from '../ReceiverInputPanel/InfoButton'
import { ExternalLink, Plus, Twitter, Instagram } from 'react-feather'
import {
  DataCard,
  CardBGContainer,
  CardBGWrapper,
  CardBGImage,
  CardImg,
  Padder,
  Details,
  MerchantLogoLink,
  MerchantLogo,
  FileInput,
  AddImage,
  Uploader,
  DetailsInput,
  EditIcon,
  StyledDelete,
} from './styled'

function MerchantImage({ imageUrl, removeImage }: { imageUrl?: string; removeImage?: () => void }) {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const styles = isHovered ? { filter: 'blur(8px)', WebkitFilter: 'blur(8px)' } : {}
  return (
    <>
      <CardBGContainer onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {isHovered && <StyledDelete onClick={removeImage} size={24} />}
        <CardBGWrapper style={styles}>
          <CardBGImage imageUrl={imageUrl} />
          <CardImg src={imageUrl} />
        </CardBGWrapper>
      </CardBGContainer>
    </>
  )
}

function FileUploader({
  loading,
  onChange,
}: {
  loading: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Uploader>
      {loading ? (
        <Loader size={'24px'} />
      ) : (
        <>
          <AddImage size={24} />
          <FileInput type="file" accept="image/jpeg, image/jpg, image/png" onChange={onChange} />
        </>
      )}
    </Uploader>
  )
}

function MerchantImageUploader({
  imageUrl,
  paddingBottom,
  loading,
  kind,
  onChange,
  removeImage,
}: {
  imageUrl?: string
  paddingBottom?: string
  loading?: boolean
  kind: string
  removeImage: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <DataCard>
      <Padder style={{ paddingBottom }} />
      <CardBGContainer>
        {kind === 'BACKGROUND' ? (
          imageUrl ? (
            <MerchantImage imageUrl={imageUrl} removeImage={removeImage} />
          ) : (
            <FileUploader onChange={onChange} loading={loading} />
          )
        ) : (
          <MerchantLogo>
            {imageUrl ? (
              <MerchantImage imageUrl={imageUrl} removeImage={removeImage} />
            ) : (
              <FileUploader onChange={onChange} loading={loading} />
            )}
          </MerchantLogo>
        )}
      </CardBGContainer>
    </DataCard>
  )
}

export function EditMerchant({
  loading,
  bgImageUrl,
  bgImageLoading,
  onChangeBgImage,
  coverImageUrl,
  coverImageLoading,
  onChangeCoverImage,
  registeredName,
  websiteURL,
  twitterURL,
  instagramURL,
  onChangeName,
  onRemoveBgImage,
  onRemoveCoverImage,
  onClickAddLink,
}: {
  loading?: boolean
  bgImageUrl?: string
  bgImageLoading?: boolean
  coverImageUrl?: string
  coverImageLoading?: boolean
  registeredName?: string
  websiteURL?: string
  twitterURL?: string
  instagramURL?: string
  onChangeBgImage: (file: File) => void
  onChangeCoverImage: (file: File) => void
  onChangeName: (name: string) => void
  onRemoveBgImage: () => void
  onRemoveCoverImage: () => void
  onClickAddLink: () => void
}) {
  const [name, setName] = useState<string>(registeredName)
  useEffect(() => setName(registeredName), [registeredName])

  const onSelectBgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    onChangeBgImage(file)
  }

  const onSelectCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    onChangeCoverImage(file)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    onChangeName(input)
  }

  return (
    <AutoColumn gap={'md'}>
      <MerchantImageUploader
        imageUrl={bgImageUrl}
        loading={bgImageLoading}
        onChange={onSelectBgImage}
        removeImage={onRemoveBgImage}
        paddingBottom="33.33%"
        kind="BACKGROUND"
      />
      <Details>
        <RowBetween>
          <MerchantLogoLink>
            <MerchantImageUploader
              imageUrl={coverImageUrl}
              loading={coverImageLoading}
              onChange={onSelectCoverImage}
              removeImage={onRemoveCoverImage}
              paddingBottom="100%"
              kind="COVER"
            />
          </MerchantLogoLink>
          <ButtonWrapper>
            {loading && <LineLoader height={4} width="50px" />}

            {websiteURL && !loading && (
              <InfoButton href={websiteURL}>
                <ExternalLink size={14} />
              </InfoButton>
            )}
            {twitterURL && !loading && (
              <InfoButton href={twitterURL}>
                <Twitter size={14} />
              </InfoButton>
            )}
            {instagramURL && !loading && (
              <InfoButton href={instagramURL}>
                <Instagram size={14} />
              </InfoButton>
            )}
            <AddButton onClickAdd={onClickAddLink}>
              <Plus size={14} />
            </AddButton>
          </ButtonWrapper>
        </RowBetween>
        <Row padding="0.5rem 0">
          {loading ? (
            <LineLoader height={4} width="100%" />
          ) : (
            <>
              <DetailsInput
                type="text"
                id="update-name-input"
                placeholder={'Click to edit'}
                value={name || ''}
                onChange={onChangeInput}
              />
              <EditIcon size={18} />
            </>
          )}
        </Row>
      </Details>
    </AutoColumn>
  )
}
