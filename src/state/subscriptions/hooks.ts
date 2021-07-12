import { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Subscription, SubscriptionProps } from '../../order'
import { AppDispatch, AppState } from '../index'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import { useApiModalError } from '../../hooks/useApiModalError'
import { useDerivedAuthState } from '../auth/hooks'
import { useToggleEndpointsModal, useToggleDeleteSubscriptionModal } from '../application/hooks'
import { 
  Field, 
  resetTypeState, 
  typeInput, 
  setPage, 
  setSubscriptions, 
  setApiState, 
  setCacheBuster,
  setSelected,
  unsetSelected
} from './actions'
import {
  ApiState,
  Metadata,
  useCreateSubscription,
  useFetchSubscriptions,
  useUpdateSubscription,
  useDeleteSubscription
} from '../../api'

export function useSubscriptionsState(): AppState['subscriptions'] {
  return useSelector<AppState, AppState['subscriptions']>((state) => state.subscriptions)
}

export function useCreateSubscriptionActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onResetState: (field: Field) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onResetState = useCallback((field: Field) => {
    dispatch(resetTypeState({ field }))
  }, [dispatch])

  return {
    onUserInput,
    onResetState
  }
}

export function useSelectSubscriptionActionHandlers(): {
  onSetSubsription: (s: Subscription) => void
  onUnsetSubscription: () => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onSetSubsription = useCallback((s: Subscription) => {
    dispatch(setSelected({ token: s.token }))
  }, [dispatch])

  const onUnsetSubscription = useCallback(() => {
    dispatch(unsetSelected())
  }, [dispatch])

  return {
    onSetSubsription,
    onUnsetSubscription
  }
}

export function usePaginateSubscriptionsActionHandlers(): {
  onClickNext: () => void
  onClickPrev: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const page = useSubscriptionsPageNumber()

  const onClickNext = useCallback(() => {
    dispatch(setPage({ page: page + 1 }))
  }, [dispatch, page])

  const onClickPrev = useCallback(() => {
    dispatch(setPage({ page: page - 1 }))
  }, [dispatch, page])

  return {
    onClickNext,
    onClickPrev,
  }
}

export function useDeleteSubscriptionCallback(): {
  state: ApiState
  execute: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const toggleDeleteModal = useToggleDeleteSubscriptionModal()
  const { apikey } = useDerivedAuthState()
  const { selected } = useSubscriptionsState()
  const { onUnsetSubscription } = useSelectSubscriptionActionHandlers()

  const { data, state, error, execute: deleteSubscription } = useDeleteSubscription()
  // show popup on error
  useApiModalError(error)

  const handleSubmit = useCallback(() => {
    if (!deleteSubscription) {
      return
    }

    deleteSubscription({
      headers: {
        'X-SFPY-API-KEY': apikey?.pvtKey,
      },
      data: {
        subscription_service: {
          subscription: {
            kind: "DELETE",
            token: selected.subscription
          }
        }
      }
    })
    .then(() => {
      toggleDeleteModal()
    })
    .catch(() => {})
  }, [selected, toggleDeleteModal, deleteSubscription, apikey])

  useEffect(() => {
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return
    
    onUnsetSubscription()
    dispatch(setPage({ page: 0 }))
    dispatch(setCacheBuster({ attempt: 1 }))
  }, [state, onUnsetSubscription, dispatch, setPage, setCacheBuster])

  return {
    state: state,
    execute: handleSubmit
  }
}

export function useUpdateSubscriptionCallback(): {
  state: ApiState
  execute: () => void
} {

  const dispatch = useDispatch<AppDispatch>()
  const toggleEndpointsModal = useToggleEndpointsModal()
  const { selected, create } = useSubscriptionsState()
  const { apikey } = useDerivedAuthState()
  const { onResetState } = useCreateSubscriptionActionHandlers()
  const { onUnsetSubscription } = useSelectSubscriptionActionHandlers()
  const { data, state, error, execute: updateSubscription } = useUpdateSubscription()
  // show popup on error
  useApiModalError(error)

  const handleSubmit = useCallback(() => {
    if (!updateSubscription) {
      return
    }

    updateSubscription({
      headers: {
        'X-SFPY-API-KEY': apikey?.pvtKey,
      },
      data: {
        subscription_service: {
          subscription: {
            kind: "UPDATE",
            token: selected.subscription,
            endpoint: create[Field.ENDPOINT]
          }
        }
      }
    })
    .then(() => {
      toggleEndpointsModal()
    })
    .catch(() => {})
  }, [create, selected, toggleEndpointsModal, updateSubscription, apikey])

  const props = data ? (data as SubscriptionProps) : undefined
  useEffect(() => {
    if (!props) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return
    
    onResetState(Field.ENDPOINT)
    onUnsetSubscription()
    dispatch(setCacheBuster({ attempt: 1 }))
  }, [state, props, onResetState, onUnsetSubscription, dispatch, setCacheBuster ])

  return {
    state: state,
    execute: handleSubmit
  }
}

export function useCreateSubscriptionCallback(): {
  state: ApiState
  execute: () => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const toggleEndpointsModal = useToggleEndpointsModal()
  // const subscriptions = useSubscriptionsList()
  const { apikey } = useDerivedAuthState()
  const { onResetState } = useCreateSubscriptionActionHandlers()
  const { create } = useSubscriptionsState()
  const { data, state, error, execute: createSubscription } = useCreateSubscription()
  // show popup on error
  useApiModalError(error)

  const handleSubmit = useCallback(() => {
    if (!createSubscription) {
      return
    }

    createSubscription({
      headers: {
        'X-SFPY-API-KEY': apikey?.pvtKey,
      },
      data: {
        subscription_service: {
          subscription: {
            kind: "CREATE",
            endpoint: create[Field.ENDPOINT]
          }
        }
      }
    })
    .then(() => {
      toggleEndpointsModal()
    })
    .catch(() => {})
  }, [create, toggleEndpointsModal, createSubscription, apikey])

  const props = data ? (data as SubscriptionProps) : undefined
  useEffect(() => {
    if (!props) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return
    
    onResetState(Field.ENDPOINT)
    dispatch(setPage({ page: 0 }))
    dispatch(setCacheBuster({ attempt: 1 }))
  }, [state, props, onResetState, dispatch, setPage, setCacheBuster ])

  return {
    state: state,
    execute: handleSubmit
  }
}

export function useDerivedCreateInfo(): {
  fields: { [field in Field]?: string }
  inputError?: string
} {
  const { create } = useSubscriptionsState()

  const fields: { [field in Field]?: string | undefined } = {}
  Object.keys(create).forEach((key: string) => {
    fields[key] = create[key]
  })

  let inputError: string | undefined
  if (!fields[Field.ENDPOINT]) {
    inputError = 'Enter a valid URL'
  }

  return {
    fields,
    inputError,
  }
}

export function useDerivedPaginationInfo(): {
  nextEnabled: boolean
  prevEnabled: boolean
} {
  const { limit, count } = useSubscriptionsMetadata()
  const page = useSubscriptionsPageNumber()
  const totalPages = Math.ceil(count / limit)

  const paginationEnabled = totalPages > 1
  const nextEnabled = paginationEnabled && page + 1 < totalPages
  const prevEnabled = paginationEnabled && page > 0

  return {
    nextEnabled,
    prevEnabled,
  }
}

export function useSubscriptionsResponse(): Subscription[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<Subscription[]>([])
  const { apikey } = useDerivedAuthState()
  const page = useSubscriptionsPageNumber()
  const cache = useSubscriptionsCacheBuster()
  const subscriptionMetadata = useSubscriptionsMetadata()
  const params = {
    ...subscriptionMetadata,
    offset: subscriptionMetadata.limit * page,
    kind: 'SUBSCRIPTION',
    // cache buster
    cache
  }

  const {
    data: { data: subscriptions, metadata },
    state,
    error,
  } = useFetchSubscriptions(params, apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = subscriptions ? (subscriptions as SubscriptionProps[]) : []
  useEffect(() => {
    dispatch(setApiState({ apistate: state }))
    if (!props || props === null) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const subscriptions = props.map((p) => new Subscription(p as SubscriptionProps))
    dispatch(setSubscriptions({ subscriptions: props, metadata }))
    setResult(subscriptions)
  }, [dispatch, state, props, setResult])

  return result
}

export function useSubscriptionsMetadata(): Metadata {
  const state = useSelector<AppState, AppState['subscriptions']['metadata']>(
    (state) => state.subscriptions.metadata
  )
  return useMemo(() => {
    if (!state) {
      return { limit: 6, offset: 0, count: 0 }
    }
    return state
  }, [state])
}

export function useSubscriptionApiState(): ApiState {
  const state = useSelector<AppState, AppState['subscriptions']['apistate']>((state) => state.subscriptions.apistate)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}

export function useSubscriptionsPageNumber(): number {
  const state = useSelector<AppState, AppState['subscriptions']['pagination']['page']>(
    (state) => state.subscriptions.pagination.page
  )
  return useMemo(() => {
    if (state < 0) {
      return 0
    }
    return state
  }, [state])
}

export function useSubscriptionsCacheBuster(): number {
  const state = useSelector<AppState, AppState['subscriptions']['cachebuster']>(
    (state) => state.subscriptions.cachebuster
  )
  return useMemo(() => {
    if (state < 0) {
      return 0
    }
    return state
  }, [state])
}

export function useSubscriptionsList(): SubscriptionProps[] {
  const state = useSelector<AppState, AppState['subscriptions']['subscriptions']>(
    (state) => state.subscriptions.subscriptions
  )
  return useMemo(() => {
    if (!state) {
      return []
    }
    return state
  }, [state])
}