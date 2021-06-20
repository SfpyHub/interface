import { Currency, Rate } from '@sfpy/web3-sdk'
import { useMemo } from 'react'

import { PriceState, usePrices } from '../data/Price'

export function useAllRates(currency: Currency): Rate | undefined {
  const [state, rate]: [PriceState, Rate] = usePrices(currency)

  return useMemo(() => {
    return state && state === PriceState.EXISTS ? rate : undefined
  }, [state, rate])
}
