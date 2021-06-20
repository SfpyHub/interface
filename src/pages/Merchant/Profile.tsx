import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { Text } from 'rebass'
import { Wrapper, BottomGrouping, Dots } from '../../components/pay/styleds'
import { ButtonError, ButtonLight } from '../../components/Button'
import { EditMerchant } from '../../components/EditMerchant'
import { AdditionalLinksModal } from '../../components/EditMerchant/AdditionalLinksModal'
import { useToggleLinksModal } from '../../state/application/hooks'
import AppBody from '../AppBody'
import {
  useMerchantActionHandlers,
  useDerivedMerchantInfo,
  useUpdateMerchantCallback,
  useFileUploader,
} from '../../state/merchant/hooks'
import { Field, URLField } from '../../state/merchant/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { ApiState } from '../../api'
import { setMerchant } from '../../state/auth/actions'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const { merchant, bgImageLoading, profileImageLoading, inputError: merchantInputError } = useDerivedMerchantInfo()
  const { onUploadImage, onChangeURLs, onChangeName } = useMerchantActionHandlers()
  const uploadFile = useFileUploader()

  // toggle links modal
  const toggleLinksModal = useToggleLinksModal()
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const isValid = !merchantInputError

  function uploadImage(field: Field, file: File) {
    onUploadImage(field, '', true)
    const promise = uploadFile(file)
    promise
      .then((res) => {
        const url = `https://ipfs.io/ipfs/${res.cid.toString()}`
        onUploadImage(field, url, false)
      })
      .catch((err) => {
        onUploadImage(field, '', false)
        throw err
      })
  }

  function uploadBgImage(file: File) {
    uploadImage(Field.BACKGROUND, file)
  }

  function uploadCoverImage(file: File) {
    uploadImage(Field.PROFILE, file)
  }

  function removeBgImage() {
    onUploadImage(Field.BACKGROUND, '', false)
  }

  function removeCoverImage() {
    onUploadImage(Field.PROFILE, '', false)
  }

  function setMerchantName(name: string) {
    onChangeName(name)
  }

  function setMerchantLinks(website, instagram, twitter) {
    onChangeURLs({
      [URLField.WEBSITE]: website,
      [URLField.INSTAGRAM]: instagram,
      [URLField.TWITTER]: twitter,
    })
    toggleLinksModal()
  }

  const { data: updateData, state, execute } = useUpdateMerchantCallback()

  useEffect(() => {
    if (updateData) {
      dispatch(setMerchant({ merchant: updateData }))
    }
  }, [updateData, dispatch])

  return (
    <AppBody>
      <Wrapper>
        <AdditionalLinksModal
          onUpdateLinks={setMerchantLinks}
          savedWebsiteURL={merchant.websiteURL}
          savedInstagramURL={merchant.instagramURL}
          savedTwitterURL={merchant.twitterURL}
        />

        <InputPanel>
          <Container>
            <EditMerchant
              loading={state === ApiState.LOADING}
              registeredName={merchant.name}
              websiteURL={merchant.websiteURL}
              instagramURL={merchant.instagramURL}
              twitterURL={merchant.twitterURL}
              bgImageUrl={merchant.backgroundImg}
              bgImageLoading={bgImageLoading || state === ApiState.LOADING}
              coverImageUrl={merchant.profileImg}
              coverImageLoading={profileImageLoading || state === ApiState.LOADING}
              onChangeBgImage={uploadBgImage}
              onChangeCoverImage={uploadCoverImage}
              onChangeName={setMerchantName}
              onRemoveBgImage={removeBgImage}
              onRemoveCoverImage={removeCoverImage}
              onClickAddLink={toggleLinksModal}
            />
          </Container>
        </InputPanel>
        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
          ) : state === ApiState.LOADING ? (
            <ButtonLight disabled>
              Loading
              <Dots />
            </ButtonLight>
          ) : (
            <ButtonError onClick={execute} id="update-merchant-button" disabled={!isValid} error={false}>
              <Text fontSize={16} fontWeight={500}>
                {merchantInputError ? merchantInputError : 'Save changes'}
              </Text>
            </ButtonError>
          )}
        </BottomGrouping>
      </Wrapper>
    </AppBody>
  )
}
