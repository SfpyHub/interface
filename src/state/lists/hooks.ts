import { ChainId, Token } from '@sfpy/web3-sdk'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../index'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public getLogoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }> }>

const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {},
  [ChainId.GANACHE]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) {
              return undefined
            }
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) {
        throw Error('Duplicate tokens.')
      }
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token,
        },
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

export function useTokenList(name: string | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byName']>((state) => state.lists.byName)
  return useMemo(() => {
    if (!name) {
      return EMPTY_LIST
    }
    const current = lists[name]?.current
    if (!current) {
      return EMPTY_LIST
    }
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, name])
}

export function useSelectedListName(): string | undefined {
  return useSelector<AppState, AppState['lists']['selectedListName']>((state) => state.lists.selectedListName)
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListName())
}

export function useSelectedListInfo(): { current: TokenList | null } {
  const selectedName = useSelectedListName()
  const listsByName = useSelector<AppState, AppState['lists']['byName']>((state) => state.lists.byName)
  const list = selectedName ? listsByName[selectedName] : undefined
  return {
    current: list?.current ?? null,
  }
}

export function useAllLists(): TokenList[] {
  const lists = useSelector<AppState, AppState['lists']['byName']>((state) => state.lists.byName)

  return useMemo(() => {
    return Object.keys(lists)
      .map((name) => lists[name].current)
      .filter((l): l is TokenList => Boolean(l))
  }, [lists])
}
