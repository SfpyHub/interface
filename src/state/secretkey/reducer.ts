import { createReducer } from '@reduxjs/toolkit'
import { ApiState } from '../../api'
import { SharedSecretProps } from '../../order'
import { setSharedSecret, setApiState, setEnabled } from './actions'
import { resetState } from '../auth/actions'

export interface SharedSecretState {
  readonly enabled: boolean
  readonly secret?: SharedSecretProps
  readonly apistate?: ApiState | null
}

const initialState: SharedSecretState = {
  enabled: false,
  secret: undefined,
  apistate: null
}

export default createReducer<SharedSecretState>(initialState, (builder) =>
  builder
    .addCase(setEnabled, (state, { payload: { enabled } }) => {
      state.enabled = enabled
    })
    .addCase(setSharedSecret, (state, { payload: { secret } }) => {
      state.secret = secret
    })
    .addCase(setApiState, (state, { payload: { apistate } }) => {
      state.apistate = apistate
    })
    .addCase(resetState, (state) => {
      state.secret = initialState.secret
    })
)
