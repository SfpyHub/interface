import { ChainId } from './constants'

export interface PaymentProps {
  token?: string
  request_id?: string
  chain_id: ChainId
  state: string
  is_eth?: boolean
  txn_hash?: string
  from?: string
  amount?: string
  token_address?: string
  rate?: string
}

export class Payment {
  private readonly token?: string
  private readonly requestId?: string
  private readonly chain?: ChainId
  private readonly state?: string
  private readonly isETH?: boolean
  private readonly txnHash?: string
  private readonly from?: string
  private readonly amount?: string
  private readonly tokenAddr?: string
  private readonly rate?: string

  public constructor({
    token,
    request_id,
    chain_id,
    state,
    is_eth,
    txn_hash,
    from,
    amount,
    token_address,
    rate,
  }: PaymentProps) {
    this.token = token ? token : undefined
    this.requestId = request_id ? request_id : undefined
    this.chain = chain_id ? chain_id : undefined
    this.state = state ? state : undefined
    this.isETH = is_eth !== undefined ? is_eth : undefined
    this.txnHash = txn_hash ? txn_hash : undefined
    this.from = from ? from : undefined
    this.amount = amount ? amount : undefined
    this.tokenAddr = token_address ? token_address : undefined
    this.rate = rate ? rate : undefined
  }

  public get id(): string | undefined {
    return this.token
  }

  public get fromAddress(): string | undefined {
    return this.from
  }

  public get isEth(): boolean {
    return this.isETH
  }

  public get status(): string {
    return this.state
  }

  public get tokenAddress(): string | undefined {
    return this.tokenAddr
  }

  public get chainId(): ChainId | undefined {
    return this.chain
  }

  public get paidAmount(): string | undefined {
    return this.amount
  }

  public get hash(): string | undefined {
    return this.txnHash
  }

  public get exchange(): string | undefined {
    return this.rate
  }
}
