import { createAction } from '@reduxjs/toolkit'
import { MerchantProps, ApiKeyProps } from '../../order'

export const setWrapped = createAction<{ merchant: MerchantProps; apikey: ApiKeyProps }>('auth/setWrapped')
export const setMerchant = createAction<{ merchant: MerchantProps }>('auth/setMerchant')
export const setApiKey = createAction<{ apikey: ApiKeyProps }>('auth/setApiKey')
export const resetState = createAction('auth/resetState')
