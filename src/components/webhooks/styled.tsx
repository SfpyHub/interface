import styled from 'styled-components'
import { darken } from 'polished'
import { AutoColumn } from '../Column'

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

export const DataCard = styled(AutoColumn)<{ disabled?: boolean }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #2172e5 100%);
  border-radius: 12px;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && '0.4'};
`

export const Endpoint = styled.div`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 0.5rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  text-align: left;
  outline: none;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg5};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
`

export const GroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  display: grid;
  grid-template-columns: 30px 2fr 1fr;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

export const EndpointNumber = styled.span`
  opacity: 0.6;
`

export const EndpointURL = styled.span`
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`