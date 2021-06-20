import React from 'react'
import styled from 'styled-components'
import { ButtonSecondary } from '../Button'

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-end;
`

const StyledMenuButton = styled(ButtonSecondary)`
  display: flex;
  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;

  padding: 0.5rem;
  border-radius: 4rem;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuItem = styled.div`
  display: flex;
  flex: 1;
  padding: 0.15rem;

  :hover {
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    path {
      stroke: ${({ theme }) => theme.primary1} !important;
    }
  }
`

export default function AddButton({
  href,
  onClickAdd,
  children,
}: {
  href?: string
  onClickAdd: () => void
  children?: React.ReactNode
}) {
  return (
    <StyledMenu>
      <StyledMenuButton>
        <MenuItem onClick={onClickAdd}>{children}</MenuItem>
      </StyledMenuButton>
    </StyledMenu>
  )
}
