import { Contract } from '@ethersproject/contracts'
import ERC20_ABI from '../constants/abis/erc20.json'
import { abi as ISfpyPoolABI } from '../constants/abis/ISfpyPool.json'
import { useMemo } from 'react'
import { ChainId } from '@sfpy/web3-sdk'
import { useActiveWeb3React } from './useWeb3'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { PRICE_ORACLE_ABI, PRICE_ORACLE_NETWORKS } from '../constants/oracle'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { getContract } from '../utils'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) {
      return null
    }
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useOracleContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PRICE_ORACLE_NETWORKS[chainId], PRICE_ORACLE_ABI)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function usePoolContract(poolAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(poolAddress, ISfpyPoolABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
      case ChainId.GANACHE:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}
