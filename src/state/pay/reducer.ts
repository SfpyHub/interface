import { createReducer } from '@reduxjs/toolkit'
import { ApiState } from '../../api'
import { Field, replacePayState, selectCurrency, setPaymentId, setApiState } from './actions'

export interface PayState {
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly paymentId: string | null
  readonly apiState: ApiState | null
}

const initialState: PayState = {
  [Field.INPUT]: {
    currencyId: '',
  },
  paymentId: null,
  apiState: null,
}

export default createReducer<PayState>(initialState, (builder) =>
  builder
    .addCase(replacePayState, (state, { payload: { field, paymentId, inputCurrencyId } }) => {
      return {
        ...state,
        [Field.INPUT]: {
          currencyId: inputCurrencyId,
        },
        paymentId,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      return {
        ...state,
        [field]: { currencyId: currencyId },
      }
    })
    .addCase(setPaymentId, (state, { payload: { paymentId } }) => {
      return {
        ...state,
        paymentId,
      }
    })
    .addCase(setApiState, (state, { payload: { apiState } }) => {
      return {
        ...state,
        apiState,
      }
    })
)
