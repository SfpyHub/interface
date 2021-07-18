export interface EventTypeProps {
  name?: string
  description?: string
}

export class EventType {
  private readonly _name?: string
  private readonly _description?: string

  public constructor({
    name,
    description
  }: EventTypeProps) {
    this._name = name
    this._description = description
  }

  public get name(): string | undefined {
    return this._name
  }

  public get description(): string | undefined {
    return this._description
  }

  public isEqual(evt: EventType): boolean {
    return this.name === evt.name
  }
}