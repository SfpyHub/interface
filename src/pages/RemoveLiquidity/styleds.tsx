import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`

export const ClickableText = styled(Text)`
  :hover: {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`

export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary1};
  border: 1px solid ${({ theme }) => theme.primary1};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		padding: 0.25rem 0.5rem;
	`};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.white};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`
