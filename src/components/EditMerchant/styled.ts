import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { PlusSquare, Edit, X } from 'react-feather'

export const DataCard = styled(AutoColumn)`
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const CardBGContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  color: ${({ theme }) => theme.red1};
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

export const Padder = styled.div`
  width: 100%;
  padding-bottom: 33.33%;
`

export const Details = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`

export const MerchantLogoLink = styled.div`
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

export const MerchantLogo = styled(CardBGWrapper)`
  border-radius: 9999px;
  overflow: hidden;
`

export const FileInput = styled.input`
  border-radius: 9999px;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: absolute;
`

export const AddImage = styled(PlusSquare)``

export const StyledDelete = styled(X)`
  z-index: 1000;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid;
  border-radius: 9999px;
  padding: 2px;
  cursor: pointer;
`

export const Uploader = styled.div`
  color: ${({ theme }) => theme.primary1};
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

export const EditIcon = styled(Edit)`
  position: absolute;
  right: 26px;
  color: ${({ theme }) => theme.text3};
`

export const DetailsInput = styled.input`
  position: relative;
  display: flex;
  padding: 8px;
  padding-right: 40px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid transparent;
  -webkit-appearance: none;

  font-size: 18px;
  font-weight: 800;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :hover {
    border: 1px solid ${({ theme }) => theme.bg3};
    outline: none;
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  :active {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const LinkInput = styled(DetailsInput)`
  border: 1px solid ${({ theme }) => theme.bg3};
  font-weight: 400;
  font-size: 16px;
`
