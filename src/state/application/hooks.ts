import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { AppState, AppDispatch } from '../index'
import { 
  addPopup, 
  ApplicationModal, 
  PopupContent, 
  removePopup, 
  setOpenModal,
  addModalError,
  removeModalError
} from './actions'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

export function useToggleLineItemModal(): () => void {
  return useToggleModal(ApplicationModal.LINEITEM)
}

export function useToggleLinksModal(): () => void {
  return useToggleModal(ApplicationModal.LINKS)
}

export function useToggleEndpointsModal(): () => void {
  return useToggleModal(ApplicationModal.ENDPOINT)
}

export function useToggleEventsModal(): () => void {
  return useToggleModal(ApplicationModal.EVENTS)
}

export function useToggleSharedSecretModal(): () => void {
  return useToggleModal(ApplicationModal.SHAREDSECRET)
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

export function useAddModalError(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addModalError({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

export function useRemoveModalError(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removeModalError({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter((item) => item.show), [list])
}

export function useActiveModalErrors(): AppState['application']['modalError'] {
  const list = useSelector((state: AppState) => state.application.modalError)
  return useMemo(() => list.filter((item) => item.show), [list])
}