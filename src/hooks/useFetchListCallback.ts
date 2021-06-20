import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'

export function useFetchListCallback(): (listName: string) => Promise<TokenList> {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    async (listName: string) => {
      return getTokenList(listName)
        .then((tokenList) => {
          dispatch(fetchTokenList.fulfilled({ name: listName, tokenList }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list of name ${listName}`, error)
          dispatch(fetchTokenList.rejected({ name: listName, errorMessage: error.message }))
          throw error
        })
    },
    [dispatch]
  )
}
