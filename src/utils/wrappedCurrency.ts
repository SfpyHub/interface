import { ChainId, Currency, CurrencyAmount, TokenAmount, Token, ETHER, USDC, WETH } from '@sfpy/web3-sdk'
import { tryParseAmount } from '../state/pay/hooks'
import { GanacheWETH9 } from '../constants'

export function weth(chainId: ChainId): Token | undefined {
  if (chainId === ChainId.GANACHE) {
    return GanacheWETH9
  }
  return WETH[chainId]
}

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Currency | undefined {
  return chainId && currency === ETHER ? ETHER : currency instanceof Token ? currency : undefined
}

export function wrappedToken(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === ETHER ? weth(chainId) : currency instanceof Token ? currency : undefined
}

export function wrappedUSDC(chainId: ChainId): Token | undefined {
  return chainId && USDC[chainId] ? USDC[chainId] : undefined
}

export function wrappedUSDCAmount(chainId: ChainId, value?: string): CurrencyAmount | undefined {
  const usdc = wrappedUSDC(chainId)
  const parsedAmount = tryParseAmount(value, usdc)
  return parsedAmount
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedToken(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(weth(token.chainId))) return ETHER
  return token
}

export function unwrappedTokenAmount(tokenAmount: TokenAmount | undefined): CurrencyAmount | undefined {
  if (!tokenAmount) return undefined
  if (tokenAmount.token.equals(weth(tokenAmount.token.chainId))) return new CurrencyAmount(ETHER, tokenAmount.raw)
  return tokenAmount
}
