import styled from 'styled-components'
import { AutoColumn } from '../Column'

export const DataCard = styled(AutoColumn)`
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const Padder = styled.div`
  width: 100%;
  padding-bottom: 33.33%;
`

export const CardBGContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

export const CardBGWrapper = styled.div`
  flex-basis: auto;
  z-index: 0;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`

export const CardBGImage = styled.span<{ imageUrl?: string }>`
  background: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : `url()`)};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`

export const CardImg = styled.img`
  bottom: 0px;
  height: 100%;
  left: 0px;
  opacity: 0;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 100%;
  z-index: -1;
`
