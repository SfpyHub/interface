import { createReducer } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { DEFAULT_LIST_OF_LISTS, DEFAULT_TOKEN_LIST_NAME } from '../../constants/lists'
import { fetchTokenList, selectList } from './actions'

export interface ListsState {
  readonly byName: {
    readonly [name: string]: {
      readonly current: TokenList | null
      readonly error: string | null
    }
  }
  readonly selectedListName: string | undefined
}

type ListState = ListsState['byName'][string]

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
}

const initialState: ListsState = {
  byName: {
    ...DEFAULT_LIST_OF_LISTS.reduce((memo, listName) => {
      memo[listName] = NEW_LIST_STATE
      return memo
    }, {}),
  },
  selectedListName: DEFAULT_TOKEN_LIST_NAME,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(fetchTokenList.fulfilled, (state, { payload: { tokenList, name } }) => {
      const current = state.byName[name]?.current
      if (!current) {
        state.byName[name] = {
          ...state.byName[name],
          error: null,
          current: tokenList,
        }
      }
    })
    .addCase(fetchTokenList.rejected, (state, { payload: { name, errorMessage } }) => {
      state.byName[name] = {
        ...state.byName[name],
        error: errorMessage,
        current: null,
      }
    })
    .addCase(selectList, (state, { payload: name }) => {
      state.selectedListName = name
      if (!state.byName[name]) {
        state.byName[name] = NEW_LIST_STATE
      }
    })
)
