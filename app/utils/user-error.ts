type ApiError = {
  data?: {
    statusMessage?: unknown
  }
}

export function getUserErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const statusMessage = (error as ApiError).data?.statusMessage

  if (
    typeof statusMessage !== 'string' ||
    !statusMessage.trim() ||
    /^(internal )?server error$/i.test(statusMessage.trim())
  ) {
    return fallback
  }

  return statusMessage
}
