import React, { useContext, useRef } from 'react'
import { Settings } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { transparentize } from 'polished'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useDarkModeManager, useUserTransactionTTL } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
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
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 15px ${({ theme }) => transparentize(0.80, theme.shadow1)}, ${({ theme }) => transparentize(0.85, theme.shadow1)} 0px 0px 3px 1px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 18.125rem;
    right: -46px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
    top: -15.5rem;
  `};
`

export const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const theme = useContext(ThemeContext)

  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const [ttl, setTtl] = useUserTransactionTTL()

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              Transaction Settings
            </Text>
            <TransactionSettings deadline={ttl} setDeadline={setTtl} />
            <Text fontWeight={600} fontSize={14}>
              Interface Settings
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Dark Mode
                </TYPE.black>
              </RowFixed>
              <Toggle isActive={darkMode} toggle={toggleDarkMode} />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
