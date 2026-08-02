import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const applications = await prisma.coach.findMany({
    where: { tag: { in: ['teacher', 'teacher_denied'] } },
    include: {
      User: {
        select: { name: true, email: true, createdAt: true },
      },
    },
  })

  return applications.map(application => ({
    id: application.id,
    name: application.User.name,
    email: application.User.email,
    role: 'Teacher',
    school: application.school ?? '',
    district: application.district ?? '',
    zipcode: application.zipcode ?? '',
    requestedAt: application.User.createdAt,
    status: application.tag === 'teacher_denied'
      ? 'Denied'
      : application.verified ? 'Approved' : 'Pending',
  }))
})
