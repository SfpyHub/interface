import { createReducer } from '@reduxjs/toolkit'
import { ApiState, Metadata } from '../../api'
import { SubscriptionProps } from '../../order'
import { 
  Field,
  typeInput, 
  setSubscriptions,
  setApiState, 
  setPage,
  setCacheBuster,
  setSelected,
  unsetSelected,
  resetTypeState
} from './actions'

export interface SubscriptionsState {
  readonly create: {
    readonly [key: string]: string
  }
  readonly selected: {
    readonly subscription: string 
  }
  readonly subscriptions?: SubscriptionProps[]
  readonly metadata?: Metadata | null
  readonly apistate?: ApiState | null
  readonly cachebuster: number
  readonly pagination: {
    readonly page: number
  }
}

const initialState: SubscriptionsState = {
  create: {
    [Field.ENDPOINT]: ""
  },
  selected: {
    subscription: ""
  },
  subscriptions: [],
  metadata: null,
  apistate: null,
  cachebuster: 0,
  pagination: {
    page: 0,
  },
}

export default createReducer<SubscriptionsState>(initialState, (builder) =>
  builder
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      state.create[field] = typedValue
    })
    .addCase(resetTypeState, (state, { payload: { field } }) => {
      state.create[field] = initialState.create[field]
    })
    .addCase(setSubscriptions, (state, { payload: { subscriptions, metadata } }) => {
      state.subscriptions = subscriptions
      state.metadata = metadata
    })
    .addCase(setApiState, (state, { payload: { apistate } }) => {
      state.apistate = apistate
    })
    .addCase(setCacheBuster, (state, { payload: { attempt } }) => {
      state.cachebuster += attempt
    })
    .addCase(setSelected, (state, { payload: { token } }) => {
      state.selected.subscription = token
    })
    .addCase(unsetSelected, (state) => {
      state.selected.subscription = initialState.selected.subscription
    })
    .addCase(setPage, (state, { payload: { page } }) => {
      page = page < 0 ? 0 : page
      return {
        ...state,
        pagination: {
          page,
        },
      }
    })
)
