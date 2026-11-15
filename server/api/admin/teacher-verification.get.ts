import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const applications = await prisma.coach.findMany({
    orderBy: {
      User: { createdAt: 'desc' },
    },
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
    role: application.tag === 'teacher' || application.tag === 'teacher_denied'
      ? 'Teacher'
      : application.tag === 'studygroup'
        ? 'Study Group'
        : application.tag === 'personal'
          ? 'Personal'
          : 'Other',
    school: application.school ?? '',
    district: application.district ?? '',
    zipcode: application.zipcode ?? '',
    requestedAt: application.User.createdAt,
    status: application.tag === 'teacher_denied'
      ? 'Denied'
      : application.tag === 'teacher'
        ? application.verified ? 'Approved' : 'Pending'
        : 'Not Required',
  }))
})
