import React from 'react'
import { Grid } from 'react-feather'
import styled from 'styled-components'

import { StyledInternalLink } from '../../theme'

const StyledMenuIcon = styled(Grid)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled(StyledInternalLink)`
  display: flex;
  align-items: center;
  justify-content: center;
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

export default function AccountMenu() {
  return (
    <StyledMenu>
      <StyledMenuButton to="/menu">
        <StyledMenuIcon />
      </StyledMenuButton>
    </StyledMenu>
  )
}
