export class ApiError extends Error {
  status: number
  path?: string
  details?: unknown

  constructor(
    message: string,
    status: number,
    options?: { path?: string; details?: unknown },
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.path = options?.path
    this.details = options?.details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
