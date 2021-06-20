import { createAction } from '@reduxjs/toolkit'

export enum Field {
  LIQUIDITY_PERCENT = 'LIQUIDITY_PERCENT',
  LIQUIDITY = 'LIQUIDITY',
  CURRENCY = 'CURRENCY',
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('burn/typedInputBurn')
