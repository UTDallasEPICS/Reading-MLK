import { prisma } from '~~/server/utils/prisma'
import { requireClassAccess } from '~~/server/utils/require-session'

export default defineEventHandler(async (event) => {
  const classToken = getRouterParam(event, 'id')

  if (!classToken) {
    throw createError({ statusCode: 400, statusMessage: 'Class token is required' })
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
