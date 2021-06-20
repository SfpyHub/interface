import { createAction } from '@reduxjs/toolkit'

export enum Field {
  SUBTOTAL = 'SUBTOTAL',
  DISCOUNT = 'DISCOUNT',
  TAX = 'TAX',
}

export const FieldMap: { [field in Field]: string } = {
  [Field.SUBTOTAL]: 'sub_total',
  [Field.TAX]: 'tax_total',
  [Field.DISCOUNT]: 'discount',
}

export const addLineItem = createAction<{ field: Field }>('create/addLineItem')
export const removeLineItem = createAction<{ field: Field }>('create/removeLineItem')
export const typeInput = createAction<{ field: Field; typedValue: string }>('create/typeInput')
export const resetState = createAction('create/resetState')
