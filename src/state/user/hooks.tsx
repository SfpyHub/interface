import { useCallback, useMemo } from 'react'
import flatMap from 'lodash.flatmap'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Token, Pool } from '@sfpy/web3-sdk'
import { useAllTokens } from '../../hooks/useTokens'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { AppDispatch, AppState } from '../index'
import { updateUserDarkMode, updateUserDeadline } from './actions'

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  )

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

/**
 * Given a token return the liquidity token that represents its liquidity shares
 * @param token tokens
 */
export function toLiquidityToken(token: Token): Token {
  return new Token(token.chainId, Pool.getAddress(token), 18, 'SFPY', 'Safepay')
}

export function useTrackedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const generatedPools: Token[] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            return token
          })
        : [],
    [tokens, chainId]
  )

  return useMemo(() => {
    return generatedPools
  }, [generatedPools])
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}
