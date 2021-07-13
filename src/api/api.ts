import axios from 'axios'
import useSWR from 'swr'
import useAxios from 'axios-hooks'
import { Method, AxiosPromise } from 'axios'
import { ApiError } from './error'
import { handleError } from './utils'
import { 
  OrderProps, 
  MerchantProps, 
  ApiKeyProps, 
  PaymentProps,
  EventTypeProps,
  SharedSecretProps,
  SubscriptionProps,
  SubscribedEventProps
} from '../order'

export const fetcher = async (url, token) => {
  const res = await axios.get(url, {
    headers: {
      'X-SFPY-API-KEY': token,
    },
  })

  if (res.statusText !== 'OK') {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    throw error
  }

  return res.data
}

export type Params = {
  token?: string
  kind?: string
  chain?: number
  limit?: number
  offset?: number
  request?: string
}

export type WrappedResponse = {
  merchant?: MerchantProps
  request?: OrderProps
}

export type WrappedMerchant = {
  merchant?: MerchantProps
  apikey?: ApiKeyProps
}

export type ApiKeyResponse = {
  data?: ApiKeyProps
}

export type MerchantResponse = {
  data?: MerchantProps
  status?: any
}

export type AuthResponse = {
  data?: WrappedMerchant
  status?: any
}

export type OrderResponse = {
  data?: WrappedResponse
  status?: any
}

export type Metadata = {
  limit?: number
  offset?: number
  count?: number
}

export type OrdersResponse = {
  data?: WrappedResponse[]
  metadata?: Metadata
}

export type PaymentsResponse = {
  data?: PaymentProps[]
  metadata?: Metadata
}

export type PaymentResponse = {
  data?: PaymentProps
}

export type EventTypeResponse = {
  data?: EventTypeProps
}

export type SharedSecretResponse = {
  data?: SharedSecretProps
}

export type SubscriptionResponse = {
  data?: SubscriptionProps
  metadata?: Metadata
}

export type SubscribeResponse = {
  data?: SubscribedEventProps
}

export enum ApiState {
  LOADING,
  SUCCESS,
  ERROR,
}

export type ApiResponse = {
  data?: any
  state: ApiState
  error?: ApiError
  execute?: (data: any) => AxiosPromise<any>
}

export function useApiRequest(url?: string, token?: string): ApiResponse {
  const { data, error } = useSWR([url, token], fetcher, {
    refreshInterval: 0,
    shouldRetryOnError: false,
  })

  return {
    data: data,
    state: error ? ApiState.ERROR : !data ? ApiState.LOADING : ApiState.SUCCESS,
    error: handleError(error),
  }
}

export function usePostRequest(url: string): ApiResponse {
  return useGenericRequest('POST', url)
}

export function useDeleteRequest(url: string): ApiResponse {
  return useGenericRequest('DELETE', url)
}

export function usePutRequest(url: string): ApiResponse {
  return useGenericRequest('PUT', url)
}

export function useGetRequest(url: string): ApiResponse {
  return useGenericRequest('GET', url)
}

export function useGenericRequest(method: Method, url: string): ApiResponse {
  const [{ data, loading, error }, executor] = useAxios(
    {
      url: url,
      method: method,
    },
    {
      useCache: false,
      ssr: false,
      manual: true,
    }
  )
  return {
    data: data,
    state: error ? ApiState.ERROR : loading ? ApiState.LOADING : ApiState.SUCCESS,
    error: handleError(error),
    execute: executor,
  }
}

export enum Environment {
  PRODUCTION = 'PRODUCTION',
  SANDBOX = 'SANDBOX',
  LOCAL = 'LOCAL',
}

const baseURLs = {
  [Environment.PRODUCTION]: '',
  [Environment.SANDBOX]: '',
  [Environment.LOCAL]: 'http://localhost:4321',
}

export class Api {
  private readonly baseURL: string = 'http://localhost:4321'
  private readonly environment: Environment = Environment.LOCAL

  public constructor(env: Environment) {
    this.environment = env
    this.baseURL = baseURLs[env]
  }
}
