import { useCallback } from 'react'
import { ApiKey, ApiKeyProps } from '../../order'
import { useDerivedAuthState } from '../auth/hooks'
import { ApiState, useUpdateApiKey } from '../../api'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'

export function useApiKeyResponse(): ApiKey | null {
  const { apikey } = useDerivedAuthState()
  return apikey
}

export function useUpdateApiKeyCallback(): {
  state: ApiState
  data?: ApiKeyProps
  execute: () => void
} {
  const {
    data: { data: apikey },
    state,
    error,
    execute: updateApiKey,
  } = useUpdateApiKey()

  // show popup on error
  useApiErrorPopup(error)

  const { apikey: currentKey } = useDerivedAuthState()
  const handleSubmit = useCallback(() => {
    if (!updateApiKey) {
      return
    }

    updateApiKey({
      headers: {
        'X-SFPY-API-KEY': currentKey.pvtKey,
      },
    }).catch(() => {})
  }, [currentKey, updateApiKey])

  return {
    state: state,
    data: apikey,
    execute: handleSubmit,
  }
}
