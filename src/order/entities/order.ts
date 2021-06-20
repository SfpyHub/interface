import { PurchaseTotalsProps, PurchaseTotals } from './purchase_total'
import { CartProps, Cart } from './cart'
import { ChainId, State } from './constants'
import { DateTime } from 'luxon'

export interface OrderProps {
  token?: string
  merchant?: string
  address?: string
  state?: State
  chain_id?: ChainId
  cart?: CartProps
  purchase_total?: PurchaseTotalsProps
  created_at?: string
  updated_at?: string
}

export class Order {
  private readonly token?: string
  private readonly merchant?: string
  private readonly address?: string
  private readonly state?: State
  private readonly chain?: ChainId
  private readonly cart?: Cart
  private readonly purchaseTotals?: PurchaseTotals
  private readonly created_at?: DateTime
  private readonly updated_at?: DateTime

  public constructor({
    token,
    merchant,
    address,
    state,
    chain_id,
    cart,
    purchase_total,
    created_at,
    updated_at,
  }: OrderProps) {
    this.token = token ? token : undefined
    this.merchant = merchant ? merchant : undefined
    this.address = address ? address : undefined
    this.state = state ? state : undefined
    this.chain = chain_id ? chain_id : undefined
    this.cart = cart ? new Cart(cart) : undefined
    this.purchaseTotals = purchase_total ? new PurchaseTotals(purchase_total) : undefined
    this.created_at = created_at ? DateTime.fromISO(created_at) : undefined
    this.updated_at = updated_at ? DateTime.fromISO(updated_at) : undefined
  }

  public get id(): string {
    return this.token
  }

  public get status(): string {
    return this.state
  }

  public get recipient(): string {
    return this.address
  }

  public get chainId(): ChainId | undefined {
    return this.chain
  } 

  public get subTotal(): string {
    return this.purchaseTotals.subTotal
  }

  public get taxTotal(): string {
    return this.purchaseTotals.taxTotal
  }

  public get grandTotal(): string {
    return this.purchaseTotals.grandTotal
  }

  public get gradTotalRaw(): string {
    return this.purchaseTotals.gradTotalRaw
  }

  public get discountTotal(): string {
    return this.purchaseTotals.discountTotal
  }

  public get completeURL(): string | undefined {
    if (this.cart) {
      return this.cart.completeURL
    }
    return undefined
  }

  public get cancelURL(): string | undefined {
    if (this.cart) {
      return this.cart.cancelURL
    }
    return undefined
  }

  public get createdAt(): string {
    return this.created_at.toLocaleString(DateTime.DATETIME_FULL)
  }

  public toJSON(): OrderProps {
    return {
      merchant: this.merchant,
      address: this.address,
      chain_id: this.chain,
      cart: this.cart?.toJSON(),
      purchase_total: this.purchaseTotals?.toJSON(),
    }
  }
}
