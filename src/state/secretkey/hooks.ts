import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SharedSecret, SharedSecretProps } from '../../order'
import { AppDispatch, AppState } from '../index'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import { useDerivedAuthState } from '../auth/hooks'
import { setSharedSecret, setApiState, setEnabled } from './actions'
import {
  ApiState,
  useSharedSecret,
  useEnableWebhooks,
  useExistsWebhooks,
  useUpdateSharedSecret
} from '../../api'

export function useSharedSecretState(): AppState['secretkey'] {
  return useSelector<AppState, AppState['secretkey']>((state) => state.secretkey)
}

export function useExistsWebhooksResponse() : {
  state: ApiState
  execute: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { apikey } = useDerivedAuthState()

  const {
    data: enabled,
    state,
    error,
    execute: existsWebhooks,
  } = useExistsWebhooks()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(() => {
    if (!existsWebhooks) {
      return
    }

    existsWebhooks({
      headers: {
        'X-SFPY-API-KEY': apikey.pvtKey,
      },
    }).catch(() => {})
  }, [apikey, existsWebhooks])

  const props = enabled ? (enabled as boolean) : false
  useEffect(() => {
    dispatch(setApiState({ apistate: state }))
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    dispatch(setEnabled({ enabled: props }))
  }, [dispatch, state, props])

  return {
    state,
    execute: handleSubmit
  }
}

export function useEnableWebhooksResponse(): {
  state: ApiState
  execute: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { apikey } = useDerivedAuthState()

  const {
    state,
    error,
    execute: enableWebhooks,
  } = useEnableWebhooks()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(() => {
    if (!enableWebhooks) {
      return
    }

    enableWebhooks({
      headers: {
        'X-SFPY-API-KEY': apikey.pvtKey,
      },
    }).catch(() => {})
  }, [apikey, enableWebhooks])

  useEffect(() => {
    dispatch(setApiState({ apistate: state }))
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    dispatch(setEnabled({ enabled: true }))
  }, [dispatch, state])

  return {
    state,
    execute: handleSubmit
  }
}

export function useSharedSecretResponse(): SharedSecret | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<SharedSecret | undefined>(undefined)
  const { apikey } = useDerivedAuthState()

  const {
    data: { data: secret },
    state,
    error,
  } = useSharedSecret(apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = secret ? (secret as SharedSecretProps) : null

  useEffect(() => {
    dispatch(setApiState({ apistate: state }))
    if (!props || props === null) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const secret = new SharedSecret(props as SharedSecretProps)
    dispatch(setSharedSecret({ secret: props }))
    setResult(secret)
  }, [dispatch, state, props, setResult])

  return result
}

export function useUpdateSharedSecretCallback(): {
  state: ApiState
  data?: SharedSecretProps
  execute: () => void
} {
  const {
    data: { data: apikey },
    state,
    error,
    execute: updateSharedSecret,
  } = useUpdateSharedSecret()

  // show popup on error
  useApiErrorPopup(error)

  const { apikey: currentKey } = useDerivedAuthState()
  const handleSubmit = useCallback(() => {
    if (!updateSharedSecret) {
      return
    }

    updateSharedSecret({
      headers: {
        'X-SFPY-API-KEY': currentKey.pvtKey,
      },
    }).catch(() => {})
  }, [currentKey, updateSharedSecret])

  return {
    state: state,
    data: apikey,
    execute: handleSubmit,
  }
}

export function useSharedSecretApiState(): ApiState {
  const state = useSelector<AppState, AppState['secretkey']['apistate']>((state) => state.secretkey.apistate)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}

export function useDerivedSharedSecretInfo(): {
  secret: SharedSecret
} {
  const { secret: props } = useSharedSecretState()

  let secretkey
  if (!props) {
    secretkey = useSharedSecretResponse()
  }

  return { secret: secretkey }
}