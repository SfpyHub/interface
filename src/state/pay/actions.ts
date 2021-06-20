import { createAction } from '@reduxjs/toolkit'
import { ApiState } from '../../api'

export enum Field {
  INPUT = 'INPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('pay/selectCurrency')
export const setPaymentId = createAction<{ paymentId: string }>('pay/setPaymentId')
export const replacePayState = createAction<{
  field: Field
  paymentId: string | null
  inputCurrencyId?: string
}>('pay/replacePayState')
export const setApiState = createAction<{ apiState: ApiState }>('pay/setApiState')
