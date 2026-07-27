import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/require-session'

const verificationUpdateSchema = z.object({
  status: z.enum(['Approved', 'Denied']).optional(),
  school: z.string().trim().min(1).max(160).optional(),
  district: z.string().trim().min(1).max(160).optional(),
  zipcode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/).optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const parsed = verificationUpdateSchema.safeParse(await readBody(event))

  if (!id || !parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid verification update' })
  }

  const application = await prisma.coach.findUnique({
    where: { id },
    select: { tag: true },
  })

  if (!application || !['teacher', 'teacher_denied'].includes(application.tag)) {
    throw createError({ statusCode: 404, statusMessage: 'Teacher application not found' })
  }

  return await prisma.coach.update({
    where: { id },
    data: {
      school: parsed.data.school,
      district: parsed.data.district,
      zipcode: parsed.data.zipcode,
      ...(parsed.data.status === 'Approved' ? { tag: 'teacher', verified: true } : {}),
      ...(parsed.data.status === 'Denied' ? { tag: 'teacher_denied', verified: false } : {}),
    },
  })
})
