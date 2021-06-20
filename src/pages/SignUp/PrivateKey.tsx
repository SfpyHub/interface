import React from 'react'
import { Redirect } from 'react-router-dom'
import ApiKeyInput from '../../components/ApiKeyInput'
import { useDerivedAuthState } from '../../state/auth/hooks'

export default function PrivateKey() {
  const { apikey } = useDerivedAuthState()

  if (!apikey) {
    return <Redirect to={`/signup`} />
  }

  return <ApiKeyInput apikey={apikey} showCopy={true} />
}
