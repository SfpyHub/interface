import { createReducer } from '@reduxjs/toolkit'
import { ApiState } from '../../api'
import { Field, URLField, uploadImage, changeName, changeURL, changeURLs, setFetchApiState } from './actions'

export interface MerchantState {
  readonly registeredName: string
  readonly registeredNameDirty: boolean
  readonly websiteURL: string
  readonly websiteURLDirty: boolean
  readonly twitterURL: string
  readonly twitterURLDirty: boolean
  readonly instagramURL: string
  readonly instagramURLDirty: boolean
  readonly fileUpload: {
    readonly [key: string]: {
      isLoading: boolean
      imgURL: string
      dirty: boolean
    }
  }
  readonly fetchApiState: ApiState | null
}

const initialState: MerchantState = {
  registeredName: '',
  registeredNameDirty: false,
  websiteURL: '',
  websiteURLDirty: false,
  twitterURL: '',
  twitterURLDirty: false,
  instagramURL: '',
  instagramURLDirty: false,
  fileUpload: {
    [Field.BACKGROUND]: {
      isLoading: false,
      dirty: false,
      imgURL: '',
    },
    [Field.PROFILE]: {
      isLoading: false,
      dirty: false,
      imgURL: '',
    },
  },
  fetchApiState: null,
}

export default createReducer<MerchantState>(initialState, (builder) =>
  builder
    .addCase(uploadImage, (state, { payload: { field, url, isLoading } }) => {
      state.fileUpload[field] = {
        isLoading: isLoading,
        dirty: true,
        imgURL: url,
      }
    })
    .addCase(changeURL, (state, { payload: { field, url } }) => {
      switch (field) {
        case URLField.INSTAGRAM:
          state.instagramURL = url
          state.instagramURLDirty = true
          break
        case URLField.TWITTER:
          state.twitterURL = url
          state.twitterURLDirty = true
          break
        case URLField.WEBSITE:
          state.websiteURL = url
          state.websiteURLDirty = true
          break
        default:
          break
      }
    })
    .addCase(changeURLs, (state, { payload }) => {
      state.instagramURL = payload[URLField.INSTAGRAM]
      state.websiteURL = payload[URLField.WEBSITE]
      state.twitterURL = payload[URLField.TWITTER]

      state.instagramURLDirty = true
      state.websiteURLDirty = true
      state.twitterURLDirty = true
    })
    .addCase(changeName, (state, { payload: { name } }) => {
      state.registeredName = name
      state.registeredNameDirty = true
    })
    .addCase(setFetchApiState, (state, { payload: { fetchApiState } }) => {
      state.fetchApiState = fetchApiState
    })
)
