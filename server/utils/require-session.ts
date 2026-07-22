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

export async function requireCoach(event: H3Event) {
  const session = await requireSession(event)

  if (session.user.role !== 'coach' && session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  return session
}
export async function requireClassAccess(event: H3Event, classToken: string) {
  const session = await requireCoach(event)

  const classroom = await prisma.class.findFirst({
    where: {
      joinToken: classToken,
      Coach: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      id: true,
      Coach: {
        where: { userId: session.user.id },
        select: { id: true },
        take: 1,
      },
    },
  })

  const coachId = classroom?.Coach[0]?.id

  if (!classroom || !coachId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have access to this class',
    })
  }

  return { session, classId: classroom.id, coachId }
}
