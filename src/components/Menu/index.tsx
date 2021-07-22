import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import { transparentize } from 'polished'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import styled from 'styled-components'

import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
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
    top: -13.25rem;
  `}
`

const MenuItem = styled(ExternalLink)`
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

const SmallMenuItem = styled(MenuItem)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `}
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://www.sfpy.co/blog/announcing-sfpy/">
            <Info size={14} />
            About
          </MenuItem>
          <SmallMenuItem id="link" href="https://www.sfpy.co/docs">
            <BookOpen size={14} />
            Docs
          </SmallMenuItem>
          <MenuItem id="link" href="https://github.com/sfpyhub">
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/PQffzU78Fx">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
