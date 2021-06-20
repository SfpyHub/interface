export interface ApiKeyProps {
  token?: string
  pvt_api_key?: string
}

export class ApiKey {
  private readonly token?: string
  private readonly pvtApiKey?: string

  constructor({ token, pvt_api_key }: ApiKeyProps) {
    this.token = token
    this.pvtApiKey = pvt_api_key
  }

  public get id(): string | undefined {
    return this.token
  }

  public get pvtKey(): string | undefined {
    return this.pvtApiKey
  }
}
