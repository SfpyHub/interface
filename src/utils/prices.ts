import { Rate, CurrencyAmount } from '@sfpy/web3-sdk'
import { basisPointsToPercent } from './index'
import { Field } from '../state/pay/actions'

// computes the maximum amount in for a trade given
// a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  rate: Rate | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: rate?.maximumAmountIn(pct),
  }
}
