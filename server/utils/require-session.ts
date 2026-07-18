import type { H3Event } from 'h3'
import { createError } from 'h3'
import { auth } from './auth'
import { prisma } from './prisma'

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

export async function requireClassManager(event: H3Event) {
  const session = await requireSession(event)

  if (session.user.role !== 'admin' && session.user.role !== 'poster') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  return session
}

export async function requireClassAccess(event: H3Event, classId: string) {
  const session = await requireClassManager(event)

  const classroom = await prisma.class.findFirst({
    where: {
      id: classId,
      ...(session.user.role === 'admin'
        ? {}
        : {
            Posters: {
              some: {
                userId: session.user.id,
              },
            },
          }),
    },
    select: {
      id: true,
    },
  })

  if (!classroom) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have access to this class',
    })
  }

  return session
}
