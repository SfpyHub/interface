import { useMemo } from 'react'
import { stringify } from 'qs'
import {
  useApiRequest,
  usePostRequest,
  useDeleteRequest,
  usePutRequest,
  useGetRequest,
  Params,
  ApiResponse,
  OrderResponse,
  OrdersResponse,
  MerchantResponse,
  AuthResponse,
  ApiKeyResponse,
  PaymentsResponse,
  PaymentResponse,
  EventTypeResponse,
  SharedSecretResponse,
  SubscriptionResponse,
  SubscribeResponse
} from './api'

export type IOrderResponse = ApiResponse & { data?: OrderResponse }
export type IOrdersResponse = ApiResponse & { data?: OrdersResponse }
export type IPaymentsResponse = ApiResponse & { data?: PaymentsResponse }
export type IPaymentResponse = ApiResponse & { data?: PaymentResponse }
export type IMerchantResponse = ApiResponse & { data?: MerchantResponse }
export type IApiKeyResponse = ApiResponse & { data?: ApiKeyResponse }
export type IAuthResponse = ApiResponse & { data?: AuthResponse }
export type IEventTypeResponse = ApiResponse & { data?: EventTypeResponse }
export type ISharedSecretResponse = ApiResponse & { data?: SharedSecretResponse }
export type ISubscriptionResponse = ApiResponse & { data?: SubscriptionResponse }
export type ISubscribeResponse = ApiResponse & { data?: SubscribeResponse }

const BASE_URL = process.env.REACT_APP_BASE_URL

export function usePayment(id: string): IOrderResponse {
  const url = `${BASE_URL}/v1/order/?token=${id}`
  const result = useApiRequest(url)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: data?.data,
      state,
      error,
    }
  }, [result])
}

export function useCreateOrder(): IOrderResponse {
  const url = `${BASE_URL}/v1/order/`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute,
    }
  }, [result])
}

export function useFetchOrders(params: Params, token: string): IOrdersResponse {
  const stringified = stringify(params)
  const url = `${BASE_URL}/v1/order?${stringified}`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
        metadata: data?.metadata,
      },
      state,
      error,
    }
  }, [result])
}

export function useFetchPayments(params: Params, token: string): IPaymentsResponse {
  const stringified = stringify(params)
  const url = `${BASE_URL}/v1/payment?${stringified}`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
        metadata: data?.metadata,
      },
      state,
      error,
    }
  }, [result])
}

export function useFetchPayment(params: Params, token: string): IPaymentResponse {
  const stringified = stringify(params)
  const url = `${BASE_URL}/v1/payment?${stringified}`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
    }
  }, [result])
}

export function useUpdateMerchant(): IMerchantResponse {
  const url = `${BASE_URL}/v1/merchant/update`
  const result = usePutRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useUpdateApiKey(): IApiKeyResponse {
  const url = `${BASE_URL}/v1/apikey/update`
  const result = usePutRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useCreateMerchant(): IAuthResponse {
  const url = `${BASE_URL}/v1/merchant/add`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useSetMerchantSecurity(): IAuthResponse {
  const url = `${BASE_URL}/v1/security/set`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useLoginMerchantWithApiKey(): IAuthResponse {
  const url = `${BASE_URL}/v1/security/login`
  const result = useGetRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useLoginMerchantWithEmailPassword(): IAuthResponse {
  const url = `${BASE_URL}/v1/security/login`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useRequestPasswordReset(): ApiResponse {
  const url = `${BASE_URL}/v1/password/reset`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useConfirmPasswordReset(): ApiResponse {
  const url = `${BASE_URL}/v1/password/confirm`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useCancelOrder(token: string): ApiResponse {
  const url = `${BASE_URL}/v1/order/cancel?token=${token}`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useEventType(token: string): IEventTypeResponse {
  const url = `${BASE_URL}/v1/notify/events`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
    }
  }, [result])
}

export function useSharedSecret(token: string): ISharedSecretResponse {
  const url = `${BASE_URL}/v1/notify/secret`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
    }
  }, [result])
}

export function useUpdateSharedSecret(): ISharedSecretResponse {
  const url = `${BASE_URL}/v1/notify/secret`
  const result = usePutRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: {
        data: data?.data,
      },
      state,
      error,
      execute,
    }
  }, [result])
}

export function useFetchSubscriptions(params: Params, token: string): ISubscriptionResponse {
  const stringified = stringify(params)
  const url = `${BASE_URL}/v1/notify/subscription?${stringified}`
  const result = useApiRequest(url, token)
  return useMemo(() => {
    const { data, state, error } = result
    return {
      data: {
        data: data?.data,
        metadata: data?.metadata,
      },
      state,
      error,
    }
  }, [result])
}

export function useCreateSubscription(): ISubscriptionResponse {
  const url = `${BASE_URL}/v1/notify/subscription`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useDeleteSubscription(): ApiResponse {
  const url = `${BASE_URL}/v1/notify/subscription`
  const result = useDeleteRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useUpdateSubscription(): ISubscriptionResponse {
  const url = `${BASE_URL}/v1/notify/subscription`
  const result = usePutRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute
    }
  }, [result])
}

export function useSubscribe(): ISubscribeResponse {
  const url = `${BASE_URL}/v1/notify/subscribe`
  const result = usePostRequest(url)
  return useMemo(() => {
    const { data, state, error, execute } = result
    return {
      data: data?.data,
      state,
      error,
      execute
    }
  }, [result])
}