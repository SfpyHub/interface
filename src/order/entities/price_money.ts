import invariant from 'tiny-invariant'
import currency from 'currency.js'

export interface PriceMoneyProps {
  currency: string
  amount: number
  negative?: boolean
}

export interface FormatProps {
  symbol?: string
  separator?: string
}

export class PriceMoney {
  private readonly currency: string
  private readonly raw: number
  private readonly negative: boolean

  public static readonly ZERO: PriceMoney = new PriceMoney({ currency: 'USD', amount: 0 })

  constructor({ currency, amount, negative = false }: PriceMoneyProps) {
    this.currency = currency
    this.raw = negative ? -amount : amount
    this.negative = negative
  }

  public format(opts?: FormatProps): string {
    return this.amount.format(opts ?? {})
  }

  public get amount(): currency {
    return currency(this.raw, { fromCents: true })
  }

  public isZero(): boolean {
    return (
      this.currency === PriceMoney.ZERO.currency &&
      this.amount instanceof currency &&
      this.amount.intValue === PriceMoney.ZERO.amount.intValue
    )
  }

  public isNegative(): boolean {
    return this.isLessThan(PriceMoney.ZERO)
  }

  public isLessThan(other: PriceMoney): boolean {
    invariant(this.currency === other.currency, `CURRENCY MISMATCH`)
    const thisAmount = this.amount
    const otherAmount = other.amount
    return thisAmount.intValue < otherAmount.intValue
  }

  public add(other: PriceMoney): PriceMoney {
    invariant(this.currency === other.currency, `CURRENCY MISMATCH`)
    const thisAmount = this.amount
    const otherAmount = other.amount
    return new PriceMoney({
      currency: this.currency,
      amount: thisAmount.add(otherAmount).intValue,
    })
  }

  public subtract(other: PriceMoney): PriceMoney {
    invariant(this.currency === other.currency, `CURRENCY MISMATCH`)
    const thisAmount = this.amount
    const otherAmount = other.amount
    return new PriceMoney({
      currency: this.currency,
      amount: thisAmount.subtract(otherAmount).intValue,
    })
  }

  public toJSON(): PriceMoneyProps {
    return {
      currency: this.currency,
      amount: this.raw,
      negative: this.negative,
    }
  }
}
