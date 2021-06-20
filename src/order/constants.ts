import React from 'react'

import Subtotal from '../assets/images/shopping-bag.svg'
import Discount from '../assets/images/tag.svg'
import Tax from '../assets/images/book-open.svg'

export interface EntityInfo {
  name: string
  iconName: string
  description: string
  helpText?: string
}

export const SUPPORTED_ENTITIES: { [key: string]: EntityInfo } = {
  SUBTOTAL: {
    name: 'Subtotal',
    iconName: Subtotal,
    description: 'Set the total amount in USD required for this payment',
    helpText: '',
  },
  DISCOUNT: {
    name: 'Discount',
    iconName: Discount,
    description: 'Optionally add a discount in USD to reduce the total amount',
    helpText: '',
  },
  TAX: {
    name: 'Tax',
    iconName: Tax,
    description: 'Optionally add a tax in USD to the payment',
    helpText: '',
  },
}
