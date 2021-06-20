import { Pool, Currency, CurrencyAmount, JSBI, Percent, Rate, TokenAmount } from '@sfpy/web3-sdk'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { usePool } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { wrappedToken } from '../../utils/wrappedCurrency'
import { useAllRates } from '../../hooks/useRates'
import { AppDispatch, AppState } from '../index'
import { useTokenBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'

export function useBurnState(): AppState['burn'] {
  return useSelector<AppState, AppState['burn']>((state) => state.burn)
}

export function useDerivedBurnInfo(
  currency: Currency | undefined
): {
  pool?: Pool | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount
    [Field.CURRENCY]?: CurrencyAmount
  }
  rate?: Rate
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue } = useBurnState()

  const [, pool] = usePool(currency)
  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pool?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pool?.liquidityToken?.address ?? '']

  const token = wrappedToken(currency, chainId)

  // liquidity values
  const totalSupply = useTotalSupply(pool?.liquidityToken)
  const liquidityValue =
    pool &&
    totalSupply &&
    userLiquidity &&
    token &&
    //
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(token, pool.getLiquidityValue(token, totalSupply, userLiquidity).raw)
      : undefined

  let percentToRemove: Percent = new Percent('0', '100')
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
        : undefined,
    [Field.CURRENCY]:
      token && percentToRemove && percentToRemove.greaterThan('0') && liquidityValue
        ? new TokenAmount(token, percentToRemove.multiply(liquidityValue.raw).quotient)
        : undefined,
  }

  const rate = useAllRates(currency)

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  return { pool, parsedAmounts, rate, error }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput,
  }
}
