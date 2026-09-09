import { z } from 'zod'
import { prisma } from '../../utils/prisma'
import { requireCoach } from '../../utils/require-session'

//split schema to solve zip code validation issue with zod
const coachProfileSchema = z.object({
  purpose: z.enum(['teacher', 'studygroup', 'other']),
  school: z.string().trim().max(160).optional(),
  district: z.string().trim().max(160).optional(),
  zipcode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/).optional(),
}).superRefine((data, context) => {
  if (data.purpose !== 'teacher') return

  if (!data.school) context.addIssue({ code: 'custom', path: ['school'], message: 'School is required' })
  if (!data.district) context.addIssue({ code: 'custom', path: ['district'], message: 'School district is required' })
  if (!data.zipcode) context.addIssue({ code: 'custom', path: ['zipcode'], message: 'ZIP code is required' })
})

export default defineEventHandler(async (event) => {
  const session = await requireCoach(event)
  const parsed = coachProfileSchema.safeParse(await readBody(event))

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid coach information',
    })
  }

  const teacher = parsed.data.purpose === 'teacher'

  return await prisma.coach.create({
    data: {
      userId: session.user.id,
      tag: parsed.data.purpose,
      verified: false,
      school: teacher ? parsed.data.school : null,
      district: teacher ? parsed.data.district : null,
      zipcode: teacher ? parsed.data.zipcode : null,
    },
  })
})
