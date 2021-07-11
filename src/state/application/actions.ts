import { createAction } from '@reduxjs/toolkit'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      error: {
        category?: string
        summary?: string
      }
    }
  | null

export enum ApplicationModal {
  WALLET,
  MENU,
  ACCOUNT,
  SETTINGS,
  LINEITEM,
  LINKS,
  ENDPOINT,
  EVENTS,
  SHAREDSECRET
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')

export const addModalError = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addModalError'
)
export const removeModalError = createAction<{ key: string }>('application/removeModalError')