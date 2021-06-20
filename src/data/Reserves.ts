import { TokenAmount, Pool, Currency } from '@sfpy/web3-sdk'
import { useMemo } from 'react'
import { abi as ISfpyPoolABI } from '../constants/abis/ISfpyPool.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks/useWeb3'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedToken } from '../utils/wrappedCurrency'

const POOL_INTERFACE = new Interface(ISfpyPoolABI)

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(currencies: (Currency | undefined)[]): [PoolState, Pool | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(() => currencies.map((currency) => wrappedToken(currency, chainId)), [chainId, currencies])

  const poolAddresses = useMemo(
    () =>
      tokens.map((token) => {
        return token ? Pool.getAddress(token) : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(poolAddresses, POOL_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const token = tokens[i]

      if (loading) return [PoolState.LOADING, null]
      if (!token) return [PoolState.INVALID, null]
      if (!reserves) return [PoolState.NOT_EXISTS, null]
      const { reserve } = reserves
      return [PoolState.EXISTS, new Pool(new TokenAmount(token, reserve.toString()))]
    })
  }, [results, tokens])
}

export function usePool(token: Currency): [PoolState, Pool | null] {
  return usePools([token])[0]
}
