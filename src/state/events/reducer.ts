import { createReducer } from '@reduxjs/toolkit'
import { ApiState } from '../../api'
import { EventTypeProps } from '../../order'
import { setEvents, setApiState } from './actions'

export interface EventsState {
  readonly allevents: EventTypeProps[]
  readonly apistate?: ApiState | null
}

const initialState: EventsState = {
  allevents: [],
  apistate: null
}

export default createReducer<EventsState>(initialState, (builder) =>
  builder
    .addCase(setEvents, (state, { payload: { events } }) => {
      state.allevents = events
    })
    .addCase(setApiState, (state, { payload: { apistate } }) => {
      state.apistate = apistate
    })
)