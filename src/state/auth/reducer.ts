import { createReducer } from '@reduxjs/toolkit'
import { MerchantProps, ApiKeyProps } from '../../order'
import { setWrapped, setApiKey, setMerchant, resetState } from './actions'

export interface AuthState {
  readonly merchant?: MerchantProps
  readonly apikey?: ApiKeyProps
}

const initialState: AuthState = {
  merchant: undefined,
  apikey: undefined,
}

export default createReducer<AuthState>(initialState, (builder) =>
  builder
    .addCase(setWrapped, (state, { payload: { merchant, apikey } }) => {
      state.merchant = merchant
      state.apikey = apikey
    })
    .addCase(setApiKey, (state, { payload: { apikey } }) => {
      state.apikey = apikey
    })
    .addCase(setMerchant, (state, { payload: { merchant } }) => {
      state.merchant = merchant
    })
    .addCase(resetState, (state) => {
      state.merchant = initialState.merchant
      state.apikey = initialState.apikey
    })
)
