import { useCallback } from 'react'
import useInterval from '../../hooks/useInterval'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useSelector } from 'react-redux'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { AppState } from '../index'

export default function Update(): null {
  const { library } = useActiveWeb3React()
  const lists = useSelector<AppState, AppState['lists']['byName']>((state) => state.lists.byName)

  const fetchList = useFetchListCallback()

  const fetchAllListsCallback = useCallback(() => {
    Object.keys(lists).forEach((name) =>
      fetchList(name).catch((error) => console.debug('interval list fetching error', error))
    )
  }, [fetchList, lists])

  useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  return null
}
