import type { H3Event } from 'h3'
import { createError } from 'h3'
import { auth } from './auth'

export async function requireSession(event: H3Event) {
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return session
}

export async function requireAdmin(event: H3Event) {
  const session = await requireSession(event)

  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  return session
}