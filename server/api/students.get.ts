import { prisma } from '~~/server/utils/prisma'
import { requireClassAccess } from '~~/server/utils/require-session'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const classToken = typeof query.classId === 'string' ? query.classId : ''

  if (!classToken) {
    throw createError({ statusCode: 400, statusMessage: 'classId is required' })
  }

  const { classId } = await requireClassAccess(event, classToken)

  const classroom = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      Students: {
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          exp: true,
        },
      },
    },
  })

  return classroom?.Students ?? []
})
