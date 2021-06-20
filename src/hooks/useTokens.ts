import { Currency, ETHER, Token } from '@sfpy/web3-sdk'
import { useMemo } from 'react'
import { useSelectedTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import { useActiveWeb3React } from './useWeb3'
import { useTokenContract } from './useContract'

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) {
      return {}
    }
    return { ...allTokens[chainId] }
  }, [chainId, allTokens])
}

// parse a name or symbol from a token response
function parseString(str: string | undefined, defaultValue: string): string {
  return str && str.length > 0 ? str : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    return new Token(
      chainId,
      address,
      decimals.result ? decimals.result[0] : 18,
      parseString(symbol.result?.[0], 'UNKNOWN'),
      parseString(tokenName.result?.[0], 'Unknown Token')
    )
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    token,
    tokenName.loading,
    tokenName.result,
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}
