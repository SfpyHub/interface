export interface CartProps {
  source?: string
  reference?: string
  complete_url: string
  cancel_url: string
}

export class Cart {
  private readonly source?: string
  private readonly reference?: string
  private readonly complete_url?: string
  private readonly cancel_url?: string

  constructor({ source, reference, complete_url, cancel_url }: CartProps) {
    this.source = source
    this.reference = reference
    this.complete_url = complete_url
    this.cancel_url = cancel_url
  }

  public get completeURL(): string {
    return this.complete_url
  }

  public get cancelURL(): string {
    return this.cancel_url
  }

  public toJSON(): CartProps {
    return {
      source: this.source,
      reference: this.reference,
      complete_url: this.complete_url,
      cancel_url: this.cancel_url,
    }
  }
}
