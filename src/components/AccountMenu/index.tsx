import React, { useRef } from 'react'
import { User, LogOut, Edit3 } from 'react-feather'
import { transparentize } from 'polished'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useLogoutActionHandler } from '../../state/auth/hooks'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import styled from 'styled-components'

import { StyledInternalLink } from '../../theme'

const StyledMenuIcon = styled(User)`
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
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
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

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 15px ${({ theme }) => transparentize(0.80, theme.shadow1)}, ${({ theme }) => transparentize(0.85, theme.shadow1)} 0px 0px 3px 1px;
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -8.25rem;
  `}
`

const MenuItem = styled(StyledInternalLink)`
  flex: 1;
  padding: 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const LogoutMenuItem = styled(MenuItem)`
  :hover {
    color: ${({ theme }) => theme.red1};
    cursor: pointer;
    text-decoration: none;
  }
`

export default function AccountMenu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.ACCOUNT)
  const toggle = useToggleModal(ApplicationModal.ACCOUNT)
  const { logout } = useLogoutActionHandler()
  useOnClickOutside(node, open ? toggle : undefined)

  function handleLogout() {
    toggle()
    logout()
  }

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <LogoutMenuItem onClick={handleLogout} id="logout" to="/login">
            <LogOut size={14} />
            Logout
          </LogoutMenuItem>
          <MenuItem id="update" to="/merchant">
            <Edit3 size={14} />
            Update
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
