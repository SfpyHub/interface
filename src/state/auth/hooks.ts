import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ParsedQs } from 'qs'
import { AppDispatch, AppState } from '../index'
import { Merchant, ApiKey } from '../../order'
import { setWrapped, resetState } from './actions'
import { useParsedQueryString } from '../../hooks/useParsedQueryString'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import {
  ApiState,
  useCreateMerchant,
  useSetMerchantSecurity,
  useLoginMerchantWithApiKey,
  useLoginMerchantWithEmailPassword,
  useRequestPasswordReset,
  useConfirmPasswordReset
} from '../../api'

export function useAuthState(): AppState['auth'] {
  return useSelector<AppState, AppState['auth']>((state) => state.auth)
}

export function useLogoutActionHandler(): {
  logout: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const logout = useCallback(() => {
    dispatch(resetState())
  }, [dispatch])

  return {
    logout,
  }
}

export function useRegisterMerchantCallback(): {
  state: ApiState
  execute: (name: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { data, state, error, execute: createMerchant } = useCreateMerchant()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (name: string) => {
      if (!createMerchant) {
        return
      }

      createMerchant({
        data: {
          merchant_service: {
            merchant: {
              registered_name: name,
            },
          },
        },
      }).catch(() => {})
    },
    [createMerchant]
  )

  useEffect(() => {
    if (!data) return
    if (!data.data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const {
      data: { merchant, api_key: apikey },
    } = data

    dispatch(setWrapped({ merchant, apikey }))
  }, [dispatch, state, data])

  return {
    state,
    execute: handleSubmit,
  }
}

export function useSetMerchantSecurityCallback(): {
  state: ApiState
  success: boolean
  execute: (email: string, password: string) => void
} {
  const [success, setSuccess] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const { apikey } = useDerivedAuthState()
  const { data, state, error, execute: setSecurity } = useSetMerchantSecurity()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (email: string, password: string) => {
      if (!setSecurity) {
        return
      }

      setSecurity({
        headers: {
          'X-SFPY-API-KEY': apikey.pvtKey,
        },
        data: {
          security_service: {
            security: {
              email,
              password,
            },
          },
        },
      }).catch(() => {})
    },
    [setSecurity, apikey]
  )

  useEffect(() => {
    if (!data) return
    if (!data.data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const {
      data: { merchant, api_key: apikey },
    } = data

    setSuccess(true)
    dispatch(setWrapped({ merchant, apikey }))
  }, [dispatch, state, data])

  return {
    state,
    success,
    execute: handleSubmit,
  }
}

export function useLoginMerchantCallback(): {
  state: ApiState
  execute: (pvtkey: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { data, state, error, execute: login } = useLoginMerchantWithApiKey()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (pvtkey: string) => {
      if (!login) {
        return
      }

      login({
        headers: {
          'X-SFPY-API-KEY': pvtkey,
        },
      }).catch(() => {})
    },
    [login]
  )

  useEffect(() => {
    if (!data) return
    if (!data.data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const {
      data: { merchant, api_key: apikey },
    } = data

    dispatch(setWrapped({ merchant, apikey }))
  }, [dispatch, state, error, data])

  return {
    state,
    execute: handleSubmit,
  }
}

export function useLoginWithEmailPasswordCallback(): {
  state: ApiState
  execute: (email: string, password: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const { data, state, error, execute: login } = useLoginMerchantWithEmailPassword()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (email: string, password: string) => {
      if (!login) {
        return
      }

      login({
        data: {
          security_service: {
            security: {
              email,
              password,
            },
          },
        },
      }).catch(() => {})
    },
    [login]
  )

  useEffect(() => {
    if (!data) return
    if (!data.data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const {
      data: { merchant, api_key: apikey },
    } = data

    dispatch(setWrapped({ merchant, apikey }))
  }, [dispatch, state, error, data])

  return {
    state,
    execute: handleSubmit,
  }
}

export function useRequestPasswordResetCallback(): {
  state: ApiState
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  execute: (email: string) => void
} {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data, state, error, execute: request } = useRequestPasswordReset()

  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (email: string) => {
      if (!request) {
        return
      }

      request({
        data: {
          password_service: {
            password: {
              email
            }
          }
        }
      }).catch(() => {})
    },
    [request]
  )

  useEffect(() => {
    if (!data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    setIsOpen(true)
  }, [state])

  return {
    state,
    isOpen,
    setIsOpen,
    execute: handleSubmit
  }
}

export function useConfirmPasswordResetCallback(): {
  state: ApiState
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  execute: (password: string) => void
  inputError?: string
} {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { data, state, error, execute: request } = useConfirmPasswordReset()
  const parsed = useResetParamsFromURLSearch()
  // show popup on error
  useApiErrorPopup(error)

  const handleSubmit = useCallback(
    (password: string) => {
      if (!request) {
        return
      }

      request({
        data: {
          password_service: {
            password: {
              email: parsed?.email,
              reset_token: parsed?.token,
              password: password
            }
          }
        }
      }).catch(() => {})
    },
    [request, parsed]
  )

  useEffect(() => {
    if (!data) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    setIsOpen(true)
  }, [state])

  let inputError: string | undefined
  if (!parsed?.token) {
    inputError = 'Invalid Param (Token)'
  }
  if (!parsed?.email) {
    inputError = 'Invalid Param (Email)'
  }
  if (!parsed) {
    inputError = 'Invalid Params'
  }

  return {
    state,
    isOpen,
    setIsOpen,
    inputError,
    execute: handleSubmit
  }
}

export function useDerivedAuthState(): {
  merchant?: Merchant
  apikey?: ApiKey
} {
  const { merchant, apikey } = useAuthState()
  if (!merchant || !apikey) return {}

  const m = new Merchant(merchant)
  const k = new ApiKey(apikey)

  return {
    merchant: m,
    apikey: k,
  }
}

export function useProvideMerchantAuth() {
  const { merchant, apikey } = useDerivedAuthState()

  return {
    merchant,
    apikey,
  }
}

function parseResetParamsFromURLParameter(urlParam: any): string | null {
  return typeof urlParam === 'string' ? (urlParam.length > 0 ? urlParam : null) : null
}

export function queryParametersToResetParams(parsedQs: ParsedQs): {
  email: string | null,
  token: string | null
} {
  const email = parseResetParamsFromURLParameter(parsedQs.email)
  const token = parseResetParamsFromURLParameter(parsedQs.token)
  return { email, token }
}

export function useResetParamsFromURLSearch(): { 
  email: string | null,
  token: string | null
} {
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<{ 
    email: string | null,
    token: string | null
  } | undefined>()

  useEffect(() => {
    const parsed = queryParametersToResetParams(parsedQs)

    setResult(parsed)
  }, [parsedQs])

  return result
}
