import { createAction } from '@reduxjs/toolkit'

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('updateUserDarkMode')
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')