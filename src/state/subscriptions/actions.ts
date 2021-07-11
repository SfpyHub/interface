import { createAction } from '@reduxjs/toolkit'
import { ApiState, Metadata } from '../../api'
import { SubscriptionProps } from '../../order'

export enum Field {
  ENDPOINT = 'ENDPOINT'
}

export const setSubscriptions = createAction<{ 
  subscriptions: SubscriptionProps[],
  metadata: Metadata 
}>('subscriptions/setSubscriptions')
export const setCacheBuster = createAction<{ attempt: number }>('subscriptions/setCacheBuster')
export const setPage = createAction<{ page: number }>('subscriptions/setPage')
export const setApiState = createAction<{ apistate: ApiState }>('subscriptions/setApiState')
export const typeInput = createAction<{ 
  field: Field, 
  typedValue: string 
}>('subscriptions/typeInput')
export const resetTypeState = createAction<{
  field: Field
}>('subscriptions/resetTypeState')