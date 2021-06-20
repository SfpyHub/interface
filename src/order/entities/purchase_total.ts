import { PriceMoney, PriceMoneyProps } from './price_money'

export interface PurchaseTotalsProps {
  sub_total?: PriceMoneyProps
  tax_total?: PriceMoneyProps
  grand_total?: PriceMoneyProps
  discount?: PriceMoneyProps
}

export class PurchaseTotals {
  private readonly subtotal?: PriceMoney
  private readonly taxtotal?: PriceMoney
  private readonly grandtotal?: PriceMoney
  private readonly discount?: PriceMoney

  constructor({ sub_total, tax_total, grand_total, discount }: PurchaseTotalsProps) {
    this.subtotal = sub_total && new PriceMoney(sub_total)
    this.taxtotal = tax_total && new PriceMoney(tax_total)
    this.grandtotal = grand_total && new PriceMoney(grand_total)
    this.discount = discount && new PriceMoney(discount)
  }

  public get subTotal(): string {
    return this.subtotal.format()
  }

  public get taxTotal(): string {
    return this.taxtotal?.format()
  }

  public get grandTotal(): string {
    return this.grandtotal.format()
  }

  public get gradTotalRaw(): string {
    return this.grandtotal.format({ symbol: '', separator: '' })
  }

  public get discountTotal(): string | null {
    return this.discount?.format()
  }

  public calculateGrandTotal(): PriceMoney {
    let result = this.subtotal || PriceMoney.ZERO
    if (this.taxtotal) {
      result = result.add(this.taxtotal)
    }
    if (this.discount) {
      result = result.subtract(this.discount)
    }

    return result
  }

  public toJSON(): PurchaseTotalsProps {
    return {
      sub_total: this.subtotal?.toJSON(),
      tax_total: this.taxtotal?.toJSON(),
      discount: this.discount?.toJSON(),
    }
  }
}
