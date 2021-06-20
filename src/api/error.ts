export const REQUEST_ERROR = 'REQUEST_ERROR'

export interface ApiErrorProps {
  category?: string
  message?: string
}

export class ApiError {
  private readonly category?: string
  private readonly message?: string

  constructor({ category, message }) {
    this.category = category
    this.message = message
  }

  public get summary(): string {
    return this.message
  }

  public get type(): string {
    return this.category
  }
}
