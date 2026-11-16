import { z } from 'zod'
import { prisma } from '../../utils/prisma'
import { requireSession } from '../../utils/require-session'

const coachBaseSchema = z.object({
  purpose: z.enum(['teacher', 'studygroup', 'other']),
  school: z.string().trim().max(160).optional(),
  district: z.string().trim().max(160).optional()
})
const coachExtendSchema = coachBaseSchema.extend({
  zipcode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/).optional().or(z.literal(''))
}).superRefine((data, context) => {
  if (data.purpose !== 'teacher') return

  if (!data.school) context.addIssue({ code: 'custom', path: ['school'], message: 'School is required' })
  if (!data.district) context.addIssue({ code: 'custom', path: ['district'], message: 'School district is required' })
  if (!data.zipcode) context.addIssue({ code: 'custom', path: ['zipcode'], message: 'ZIP code is required' })
})

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)

  if (!['reader', 'coach', 'admin'].includes(session.user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const parsed = coachExtendSchema.safeParse(await readBody(event))

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid coach information',
    })
  }

  const teacher = parsed.data.purpose === 'teacher'

  return await prisma.$transaction(async (transaction) => {
    const coach = await transaction.coach.create({
      data: {
        userId: session.user.id,
        tag: parsed.data.purpose,
        verified: false,
        school: teacher ? parsed.data.school : null,
        district: teacher ? parsed.data.district : null,
        zipcode: teacher ? parsed.data.zipcode : null,
      },
    })

    if (session.user.role === 'reader') {
      await transaction.user.update({
        where: { id: session.user.id },
        data: { role: 'coach' },
      })
    }

    return coach
  })
})
