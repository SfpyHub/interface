import currency from 'currency.js'
import { createReducer } from '@reduxjs/toolkit'
import { Field } from './actions'
import { addLineItem, removeLineItem, typeInput, resetState } from './actions'

export interface SerializablePriceMoney {
  currency: string
  amount: number
  negative?: boolean
}

export interface CreateState {
  readonly lineItems: {
    readonly [key: string]: SerializablePriceMoney
  }
}

const initialState: CreateState = {
  lineItems: {
    [Field.SUBTOTAL]: { currency: 'USD', amount: 0 },
  },
}

export default createReducer<CreateState>(initialState, (builder) =>
  builder
    .addCase(addLineItem, (state, { payload: { field } }) => {
      const value: SerializablePriceMoney = { currency: 'USD', amount: 0 }
      if (field === Field.DISCOUNT) {
        value.negative = true
      }

      state.lineItems[field] = value
    })
    .addCase(removeLineItem, (state, { payload: { field } }) => {
      delete state.lineItems[field]
    })
    .addCase(resetState, () => {
      return initialState
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      let parsedValue: currency
      try {
        parsedValue = currency(typedValue)
      } catch (error) {
        parsedValue = currency(0)
        console.debug(`Failed to parse user input: "${typedValue}"`)
      }

      const value: SerializablePriceMoney = { currency: 'USD', amount: parsedValue.value }
      if (field === Field.DISCOUNT) {
        value.negative = true
      }

      state.lineItems[field] = value
    })
)
