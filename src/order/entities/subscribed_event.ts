export interface SubscribedEventProps {
  token?: string
  subscription_id?: string
  event?: string
}

export class SubscribedEvent {
  private readonly _token?: string
  private readonly _subscription_id?: string
  private readonly _event?: string

  public constructor({
    token,
    subscription_id,
    event
  }: SubscribedEventProps) {
    this._token = token
    this._subscription_id = subscription_id
    this._event = event
  }

  public get token(): string | undefined {
    return this._token
  }

  public get subscriptionId(): string | undefined {
    return this._subscription_id
  }

  public get event(): string | undefined {
    return this._event
  }
}