import { prisma } from '../../utils/prisma'
import { requireClassAccess, requireSession } from '../../utils/require-session'
import { ensureMlkClassMembership } from '../../utils/ensure-mlk-class-membership'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const classToken = typeof query.classId === 'string' ? query.classId : ''

  if (classToken) {
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
  }

  const session = await requireSession(event)
  await ensureMlkClassMembership(session.user.id)

  return await prisma.student.findMany({
    where: {
      parentUserId: session.user.id,
    },
  })
})
