import { createAction } from '@reduxjs/toolkit'
import { ApiState, Metadata } from '../../api'
import { WrappedProps, PaymentProps } from '../../order'

export const setPaymentId = createAction<{ paymentId: string }>('request/setPaymentId')
export const setApiState = createAction<{ apiState: ApiState }>('request/setApiState')
export const setRequestsApiState = createAction<{ apiState: ApiState }>('request/setRequestsApiState')
export const setPaymentsApiState = createAction<{ apiState: ApiState }>('request/setPaymentsApiState')
export const setPaymentApiState = createAction<{ apiState: ApiState }>('request/setPaymentApiState')
export const setRequestsPage = createAction<{ page: number }>('request/setRequestsPage')
export const setRequests = createAction<{
  data: WrappedProps[]
  metadata: Metadata
  error: string
}>('request/setRequests')
export const setPayments = createAction<{
  data: PaymentProps[]
  metadata: Metadata
  error: string
}>('request/setPayments')
export const setPayment = createAction<{
  data: PaymentProps
  error: string
}>('request/setPayment')
