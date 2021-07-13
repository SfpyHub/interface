import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiState, useEventType } from '../../api'
import { useApiErrorPopup } from '../../hooks/useApiErrorPopup'
import { EventType, EventTypeProps } from '../../order'
import { useDerivedAuthState } from '../auth/hooks'
import { AppDispatch, AppState } from '../index'
import { setApiState, setEvents } from './actions'

export function useEventsState(): AppState['events'] {
  return useSelector<AppState, AppState['events']>((state) => state.events)
}

export function useAllEventsResponse(): EventType[] | undefined {
  const dispatch = useDispatch<AppDispatch>()
  const [result, setResult] = useState<EventType[]>([])
  const { apikey } = useDerivedAuthState()

  const {
    data: { data: events, metadata },
    state,
    error,
  } = useEventType(apikey?.pvtKey)

  // show popup on error
  useApiErrorPopup(error)

  const props = events ? (events as EventTypeProps[]) : []
  useEffect(() => {
    dispatch(setApiState({ apistate: state }))
    if (!props || props === null) return
    if (state === ApiState.LOADING) return
    if (state === ApiState.ERROR) return

    const events = props.map((p) => new EventType(p as EventTypeProps))
    dispatch(setEvents({ events: props }))
    setResult(events)
  }, [dispatch, state, props, setResult])

  return result
}

export function useAllEvents(): EventType[] {
  const state = useEventsState()
  return state.allevents.map(prop => {
    return new EventType(prop as EventTypeProps)
  })
}

export function useEventsApiState(): ApiState {
  const state = useSelector<AppState, AppState['events']['apistate']>((state) => state.events.apistate)
  return useMemo(() => {
    if (!state) {
      return ApiState.LOADING
    }
    return state
  }, [state])
}