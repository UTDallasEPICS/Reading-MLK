import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getQuery, getRouterParam } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // AuthZ guard: only admins can delete faculty ---
  if (event.context.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Parse/validate route param ---
  const idParam = getRouterParam(event, 'id')
  const facultyId = Number(idParam)
  if (!facultyId || Number.isNaN(facultyId)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid faculty id' })
  }

  // Optional hard deletion flag (?hard=true) ---
  const { hard } = getQuery(event) as { hard?: string }
  const doHardDelete = hard === 'true'

  // Fetch the profile so we know which user it belongs to ---
  const profile = await prisma.facultyProfile.findUnique({
    where: { id: facultyId },
    select: { id: true, user_id: true },
  })
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Faculty not found' })
  }

  // Remove join rows first (to avoid FK errors), then delete the profile ---
  await prisma.$transaction([
    prisma.teacherToClass.deleteMany({ where: { teacher_id: facultyId } }),
    prisma.facultyProfile.delete({ where: { id: facultyId } }),
  ])

  // Hard delete (optional): delete the underlying User only if they have no other roles ---
  if (doHardDelete) {
    const userId = profile.user_id

    // Count other roles still attached to this user
    const [parentCount, adminCount, facultyCount] = await prisma.$transaction([
      prisma.parentProfile.count({ where: { user_id: userId } }),
      prisma.adminProfile.count({ where: { admin_id: userId } }),
      prisma.facultyProfile.count({ where: { user_id: userId } }), // should be 0 after the delete above
    ])

    const hasAnyOtherRole = (parentCount + adminCount + facultyCount) > 0

    if (!hasAnyOtherRole) {
      // Safe to delete the User record itself
      await prisma.user.delete({ where: { id: userId } })
    }
  }

  return { success: true }
})