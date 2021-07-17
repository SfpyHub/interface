import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { User, Key, Zap } from 'react-feather'
import { TYPE } from '../../theme'
import { StyledInternalLink } from '../../theme'

export const Item = styled(StyledInternalLink)`
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  
  background: ${({ theme }) => `
    radial-gradient(92.78% 103.09% at 50.06% 7.22%, 
      rgba(255, 58, 212, 0.07) 0%, 
      rgba(255, 255, 255, 0.043) 100%), 
    radial-gradient(100% 97.16% at 0% 12.22%, 
      ${transparentize(0.2, theme.primary5)} 0%, 
      ${transparentize(0.2, theme.primary1)} 0%)
  `};
    
	border-radius: 12px;
  margin: 12px;

	transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1) 0s;
	cursor: pointer;

	:hover{
		transform: translate3d(2px, 2px, 10px);
    text-decoration: none;
	}
`

const StyledUserIcon = styled(User)`
  height: 40px;
  width: 40px;

  > * {
    stroke: ${({ theme }) => theme.white};
  }
`

const StyledKeyIcon = styled(Key)`
  height: 40px;
  width: 40px;

  > * {
    stroke: ${({ theme }) => theme.white};
  }
`

const StyledZapIcon = styled(Zap)`
  height: 40px;
  width: 40px;

  > * {
    stroke: ${({ theme }) => theme.white};
  }
`

export function UserItem() {
  return (
    <Item to="/profile">
      <StyledUserIcon />
      <TYPE.white>
        Profile
      </TYPE.white>
    </Item>
  )
}

export function KeyItem() {
  return (
    <Item to="/developer">
      <StyledKeyIcon />
      <TYPE.white>
        API Key
      </TYPE.white>
    </Item>
  )
}

export function WebhookItem() {
  return (
    <Item to="/webhooks">
      <StyledZapIcon />
      <TYPE.white>
        Webhooks
      </TYPE.white>
    </Item>
  )
}

