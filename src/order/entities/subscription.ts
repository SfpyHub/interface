import { EventTypeProps, EventType } from "./event_type";

export interface SubscriptionProps {
  token?: string
  endpoint?: string
  subscribed_events?: EventTypeProps[]
}

export class Subscription {
  private readonly _token?: string
  private readonly _endpoint?: string
  private readonly _events?: EventType[]

  public constructor({
    token,
    endpoint,
    subscribed_events
  }: SubscriptionProps) {
    this._token = token
    this._endpoint = endpoint
    this._events = subscribed_events.map(e => new EventType(e))
  }

  public get token(): string | undefined {
    return this._token
  }

  public get endpoint(): string | undefined {
    return this._endpoint
  }

  public get events(): EventType[] {
    return this._events
  }
}