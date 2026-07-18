import { prisma } from '~~/server/utils/prisma'
import { requireClassAccess } from '~~/server/utils/require-session'

export default defineEventHandler(async (event) => {
  const classId = getRouterParam(event, 'id')

  if (!classId) {
    throw createError({ statusCode: 400, statusMessage: 'Class ID is required' })
  }

  await requireClassAccess(event, classId)

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
