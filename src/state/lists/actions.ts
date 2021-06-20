import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'

export const fetchTokenList: Readonly<{
  fulfilled: ActionCreatorWithPayload<{ tokenList: TokenList; name: string }>
  rejected: ActionCreatorWithPayload<{ name: string; errorMessage: string }>
}> = {
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
}

export const selectList = createAction<string>('lists/selectList')
