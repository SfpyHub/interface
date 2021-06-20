import React from 'react'
import styled from 'styled-components'
import { ExternalLink, Twitter, Instagram } from 'react-feather'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import ReceiverDetails from './ReceiverDetails'
import InfoButton, { ButtonWrapper } from './InfoButton'
import { LineLoader } from '../Loader'
import { DataCard, Padder, CardBGContainer, CardBGWrapper, CardBGImage, CardImg } from './styled'

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

const Details = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`

const MerchantLogoLink = styled.div`
  margin-left: -4px;
  margin-bottom: -4px;
  width: 25%;
  margin-top: -18%;
  min-width: 49px;
  outline-style: none;
  transition-property: background-color, box-shadow;
  transition-duration: 0.2s;
  background-color: ${({ theme }) => theme.bg1};
  border: 4px solid ${({ theme }) => theme.bg2};
  border-radius: 9999px;
  z-index: 0;
`

const MerchantLogoPadder = styled(Padder)`
  padding-bottom: 100%;
`

const MerchantLogo = styled(CardBGWrapper)`
  border-radius: 9999px;
  overflow: hidden;
`

function ReceiverCoverImg({ imageUrl, style }: { imageUrl?: string; style?: React.CSSProperties }) {
  return <CardImg src={imageUrl} style={style} />
}

interface ReceiverInputProps {
  id: string
  label: string
  name?: string
  bgImg?: string
  profileImg?: string
  website?: string
  twitter?: string
  instagram?: string
  loading?: boolean
}

export default function ReceiverInputPanel({
  id,
  label,
  name,
  bgImg,
  profileImg,
  website,
  twitter,
  instagram,
  loading,
}: ReceiverInputProps) {
  return (
    <>
      <InputPanel id={id}>
        <Container>
          <AutoColumn gap={'md'}>
            <DataCard>
              <Padder />
              <CardBGContainer>
                <CardBGWrapper>
                  <CardBGImage imageUrl={bgImg} />
                  <ReceiverCoverImg imageUrl={bgImg} />
                </CardBGWrapper>
              </CardBGContainer>
            </DataCard>
            <Details>
              <RowBetween>
                <MerchantLogoLink>
                  <DataCard>
                    <MerchantLogoPadder />
                    <CardBGContainer>
                      <MerchantLogo>
                        <CardBGImage imageUrl={profileImg} />
                        <ReceiverCoverImg imageUrl={profileImg} />
                      </MerchantLogo>
                    </CardBGContainer>
                  </DataCard>
                </MerchantLogoLink>
                <ButtonWrapper>
                  {loading && <LineLoader height={4} width="50px" />}

                  {website && !loading && (
                    <InfoButton href={website}>
                      <ExternalLink size={14} />
                    </InfoButton>
                  )}
                  {twitter && !loading && (
                    <InfoButton href={twitter}>
                      <Twitter size={14} />
                    </InfoButton>
                  )}
                  {instagram && !loading && (
                    <InfoButton href={instagram}>
                      <Instagram size={14} />
                    </InfoButton>
                  )}
                </ButtonWrapper>
              </RowBetween>
              <Row>{loading ? <LineLoader height={4} width="100%" /> : <ReceiverDetails name={name} />}</Row>
            </Details>
          </AutoColumn>
        </Container>
      </InputPanel>
    </>
  )
}
