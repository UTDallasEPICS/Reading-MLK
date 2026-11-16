import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'

function getCoachRole(tag: string) {
  if (tag === 'teacher' || tag === 'teacher_denied') return 'Teacher'
  if (tag === 'studygroup') return 'Study Group'
  if (tag === 'personal') return 'Personal'
  return 'Other'
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [
    totalTeachers,
    verifiedTeachers,
    totalNonTeacherCoaches,
    totalStudents,
    activeClasses,
    pendingApplications,
    recentCoaches,
  ] = await Promise.all([
    prisma.coach.count({ where: { tag: 'teacher' } }),
    prisma.coach.count({ where: { tag: 'teacher', verified: true } }),
    prisma.coach.count({
      where: {
        tag: { notIn: ['teacher', 'teacher_denied'] },
      },
    }),
    prisma.student.count(),
    prisma.class.count({ where: { Students: { some: {} } } }),
    prisma.coach.findMany({
      where: { tag: 'teacher', verified: false },
      include: {
        User: {
          select: { name: true, createdAt: true },
        },
      },
    }),
    prisma.coach.findMany({
      where: { User: { isNot: { role: 'admin' } } },
      orderBy: { User: { createdAt: 'desc' } },
      take: 5,
      include: {
        User: {
          select: { name: true, email: true, createdAt: true },
        },
      },
    }),
  ])

  return {
    totalTeachers,
    verifiedTeachers,
    unverifiedTeachers: totalTeachers - verifiedTeachers,
    totalNonTeacherCoaches,
    totalStudents,
    activeClasses,
    pendingApplications: pendingApplications.map(application => ({
      id: application.id,
      name: application.User.name,
      organization: application.school ?? '',
      district: application.district ?? '',
    })),
    recentCoaches: recentCoaches.map(coach => ({
      id: coach.id,
      name: coach.User.name,
      email: coach.User.email,
      role: getCoachRole(coach.tag),
      createdAt: coach.User.createdAt,
    })),
  }
})
