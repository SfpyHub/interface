export interface SharedSecretProps {
  token?: string
  secret?: string
}

export class SharedSecret {
  private readonly _token?: string
  private readonly _secret?: string

  public constructor({ token, secret }: SharedSecretProps) {
    this._token = token
    this._secret = secret
  }

  public get token(): string | undefined {
    return this._token
  }

  public get secret(): string | undefined {
    return this._secret
  }
}