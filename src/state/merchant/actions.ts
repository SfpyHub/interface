import { createAction } from '@reduxjs/toolkit'
import { ApiState } from '../../api'

export enum Field {
  BACKGROUND = 'BACKGROUND',
  PROFILE = 'PROFILE',
}

export enum URLField {
  WEBSITE = 'WEBSITE',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
}

export const uploadImage = createAction<{ field: Field; url: string; isLoading: boolean }>('merchant/uploadImage')
export const changeURL = createAction<{ field: URLField; url: string }>('merchant/changeURL')
export const changeName = createAction<{ name: string }>('merchant/changeName')
export const changeURLs = createAction<{ URLField: string }>('merchant/changeURLs')
export const setFetchApiState = createAction<{ fetchApiState: ApiState }>('merchant/setFetchApiState')
