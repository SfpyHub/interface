import { useEffect } from 'react'
import { ApiError } from '../api'
import { useAddPopup } from '../state/application/hooks'

export function useApiErrorPopup(error?: ApiError) {
  const addPopup = useAddPopup()
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
