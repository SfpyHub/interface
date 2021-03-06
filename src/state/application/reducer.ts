import { createReducer, nanoid } from '@reduxjs/toolkit'
import { 
  addPopup, 
  PopupContent, 
  removePopup, 
  ApplicationModal, 
  setOpenModal, 
  updateBlockNumber,
  addModalError,
  removeModalError
} from './actions'

export type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly openModal: ApplicationModal | null
  readonly popupList: PopupList
  readonly modalError: PopupList
}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  modalError: [],
  openModal: null,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
      state.modalError = initialState.modalError
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(addModalError, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.modalError = (key ? state.popupList.filter((popup) => popup.key !== key) : state.modalError).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
    .addCase(removeModalError, (state, { payload: { key } }) => {
      state.modalError.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
