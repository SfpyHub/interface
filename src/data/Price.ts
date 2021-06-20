import JSBI from 'jsbi'
import { Currency, CurrencyAmount, Rate, TEN } from '@sfpy/web3-sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../hooks/useWeb3'
import { useOracleContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { wrappedCurrency, wrappedUSDC } from '../utils/wrappedCurrency'

export enum PriceState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePrices(currency: Currency | undefined): [PriceState, Rate | null] {
  const { chainId } = useActiveWeb3React()

  const [base, quote] = useMemo(() => {
    return [wrappedUSDC(chainId), wrappedCurrency(currency, chainId)]
  }, [currency, chainId])

  const symbol = useMemo(() => {
    return currency ? currency.symbol : undefined
  }, [currency])

  const contract = useOracleContract()
  let result = useSingleCallResult(contract, 'price', [symbol])
  if (!contract || !result) {
    // for testnets that aren't supported by the compound
    // open oracle, use a dummy fixed exchange rate of 1
    result = { result: ['1000000'], loading: false, valid: true, syncing: false, error: false }
  }

  return useMemo(() => {
    let { result: prices, loading } = result

    if (loading) return [PriceState.LOADING, null]
    if (!prices) return [PriceState.INVALID, null]
    if (prices.length === 0) return [PriceState.NOT_EXISTS, null]

    const price = JSBI.BigInt(prices[0])
    if (!quote) {
      return [PriceState.NOT_EXISTS, null]
    }
    const amount = JSBI.exponentiate(TEN, JSBI.BigInt(quote.decimals))
    return [
      PriceState.EXISTS,
      new Rate(
        //
        new CurrencyAmount(base, price),
        new CurrencyAmount(quote, amount)
      ),
    ]
  }, [result, base, quote])
}
