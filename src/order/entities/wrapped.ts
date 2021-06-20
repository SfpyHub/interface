import { Order, OrderProps } from './order'
import { Merchant, MerchantProps } from './merchant'

export interface WrappedProps {
  merchant?: MerchantProps
  request?: OrderProps
}

export class Wrapped {
  private readonly request?: Order
  private readonly merchant?: Merchant

  public constructor({ merchant, request }: WrappedProps) {
    this.request = request ? new Order(request) : undefined
    this.merchant = merchant ? new Merchant(merchant) : undefined
  }

  public get order(): Order | undefined {
    return this.request
  }

  public get client(): Merchant | undefined {
    return this.merchant
  }
}
