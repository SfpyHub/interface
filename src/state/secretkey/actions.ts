import { createAction } from '@reduxjs/toolkit'
import { ApiState } from '../../api'
import { SharedSecretProps } from '../../order'

export const setSharedSecret = createAction<{ secret: SharedSecretProps }>('secret/setSharedSecret')
export const setApiState = createAction<{ apistate: ApiState }>('secret/setApiState')