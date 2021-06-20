import { createReducer } from '@reduxjs/toolkit'
import { ApiState, Metadata } from '../../api'
import { WrappedProps, PaymentProps } from '../../order'
import {
  setPaymentId,
  setApiState,
  setRequestsApiState,
  setPaymentsApiState,
  setRequests,
  setPayments,
  setRequestsPage,
  setPaymentApiState,
  setPayment,
} from './actions'

export interface RequestState {
  readonly paymentId: string | null
  readonly apiState: ApiState | null
  readonly requests: {
    readonly data?: WrappedProps[]
    readonly metadata?: Metadata | null
    readonly error?: string | null
    readonly state?: ApiState | null
  }
  readonly payments: {
    readonly data?: PaymentProps[]
    readonly metadata?: Metadata | null
    readonly error?: string | null
    readonly state?: ApiState | null
  }
  readonly payment: {
    readonly data?: PaymentProps | null
    readonly error?: string | null
    readonly state?: ApiState | null
  }
  readonly pagination: {
    readonly page: number
  }
}

const initialState: RequestState = {
  paymentId: null,
  apiState: null,
  requests: {
    data: [],
    metadata: null,
    error: null,
    state: null,
  },
  payments: {
    data: [],
    metadata: null,
    error: null,
    state: null,
  },
  payment: {
    data: null,
    error: null,
    state: null,
  },
  pagination: {
    page: 0,
  },
}

export default createReducer<RequestState>(initialState, (builder) =>
  builder
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
    .addCase(setRequestsApiState, (state, { payload: { apiState } }) => {
      return {
        ...state,
        requests: {
          ...state.requests,
          state: apiState,
        },
      }
    })
    .addCase(setPaymentsApiState, (state, { payload: { apiState } }) => {
      return {
        ...state,
        payments: {
          ...state.payments,
          state: apiState,
        },
      }
    })
    .addCase(setPaymentApiState, (state, { payload: { apiState } }) => {
      return {
        ...state,
        payment: {
          ...state.payment,
          state: apiState,
        },
      }
    })
    .addCase(setRequests, (state, { payload: { data, metadata, error } }) => {
      return {
        ...state,
        requests: {
          ...state.requests,
          data,
          metadata,
          error,
        },
      }
    })
    .addCase(setPayments, (state, { payload: { data, metadata, error } }) => {
      return {
        ...state,
        payments: {
          ...state.payments,
          data,
          metadata,
          error,
        },
      }
    })
    .addCase(setPayment, (state, { payload: { data, error } }) => {
      return {
        ...state,
        payment: {
          ...state.payment,
          data,
          error,
        },
      }
    })
    .addCase(setRequestsPage, (state, { payload: { page } }) => {
      page = page < 0 ? 0 : page
      return {
        ...state,
        pagination: {
          page,
        },
      }
    })
)
