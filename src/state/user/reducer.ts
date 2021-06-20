import { DEFAULT_DEADLINE_FROM_NOW } from '@sfpy/web3-sdk'
import { createReducer } from '@reduxjs/toolkit'
import { 
  updateMatchesDarkMode, 
  updateUserDarkMode,
  updateUserDeadline 
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  userDarkMode: boolean | null
  matchesDarkMode: boolean

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  timestamp: number
}

export const initialState: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  timestamp: currentTimestamp(),
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
)
