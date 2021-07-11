import { useEffect } from 'react'
import { ApiError } from '../api'
import { useAddModalError } from '../state/application/hooks'

export function useApiModalError(error?: ApiError) {
  const addPopup = useAddModalError()
  const category = error?.type
  const summary = error?.summary
  useEffect(() => {
    if (summary) {
      addPopup({
        error: {
          category: category,
          summary: summary,
        },
      })
    }
  }, [category, summary, addPopup])
}
