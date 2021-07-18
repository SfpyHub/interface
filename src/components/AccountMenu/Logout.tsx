import React from 'react'
import { LogOut } from 'react-feather'
import { useLogoutActionHandler } from '../../state/auth/hooks'
import styled from 'styled-components'

const StyledMenuIcon = styled(LogOut)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.red1};
  }

  > svg {
    margin-top: 2px;
  }
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

export default function Logout() {
  const { logout } = useLogoutActionHandler()
  
  function handleLogout() {
    logout()
  }

  return (
    <StyledMenu>
      <StyledMenuButton onClick={handleLogout}>
        <StyledMenuIcon />
      </StyledMenuButton>
    </StyledMenu>
  )
}
