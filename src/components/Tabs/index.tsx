import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import { PaddedColumn } from '../SearchModal/styleds'
import { RowBetween } from '../Row'

const StyledPaddedColumn = styled(PaddedColumn)`
  width: 100%;
  padding-bottom: 20px;
`

const ToggleWrapper = styled(RowBetween)`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 6px;
  width: 100%;
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg3)};
  color: ${({ theme, active }) => (active ? theme.primaryText1 : theme.text2)};
  user-select: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export type Tab = {
  title: string
  key: string
}

export function Tabs({
  tabs,
  active,
  styles,
  onClick,
}: {
  tabs: Tab[]
  active: string
  styles?: CSSProperties
  onClick: (key: string) => void
}) {
  const options = tabs.map((t, i) => {
    return (
      <ToggleOption key={i} onClick={() => onClick(t.key)} active={active === t.key}>
        {t.title}
      </ToggleOption>
    )
  })
  return (
    <StyledPaddedColumn style={styles}>
      <ToggleWrapper>{options}</ToggleWrapper>
    </StyledPaddedColumn>
  )
}
