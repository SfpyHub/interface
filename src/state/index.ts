import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import user from './user/reducer'
import multicall from './multicall/reducer'
import transactions from './transactions/reducer'
import create from './create/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import pay from './pay/reducer'
import request from './requests/reducer'
import merchant from './merchant/reducer'
import auth from './auth/reducer'
import secretkey from './secretkey/reducer'
import subscriptions from './subscriptions/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  reducer: {
    application,
    transactions,
    user,
    pay,
    multicall,
    burn,
    create,
    lists,
    request,
    merchant,
    auth,
    secretkey,
    subscriptions
  },
  middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
