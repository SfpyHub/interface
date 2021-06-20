import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import { useEagerConnect } from '../../hooks/useWeb3'
import { NetworkContextName } from '../../constants'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { error: networkError } = useWeb3React(NetworkContextName)

  const triedEager = useEagerConnect()

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>Error</Message>
      </MessageWrapper>
    )
  }

  return children
}
