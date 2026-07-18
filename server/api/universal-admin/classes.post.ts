import { z } from 'zod'
import { prisma } from '../../utils/prisma'
import { requireClassManager } from '../../utils/require-session'

const classCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.enum(['Teacher', 'Study Group', 'Community Group', 'Other']),
  school: z.string().trim().max(160).optional(),
  district: z.string().trim().max(160).optional(),
  zipcode: z.string().trim().max(10).optional(),
})

const posterTagByClassType = {
  Teacher: 'teacher',
  'Study Group': 'studygroup',
  'Community Group': 'other',
  Other: 'other',
} as const

export default defineEventHandler(async (event) => {
  const session = await requireClassManager(event)

  const parsed = classCreateSchema.safeParse(await readBody(event))

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid class information',
    })
  }

  const data = parsed.data
  const posterData = {
    tag: posterTagByClassType[data.type],
    school: data.school || null,
    district: data.district || null,
    zipcode: data.zipcode || null,
  }

  return await prisma.$transaction(async (transaction) => {
    const poster = await transaction.poster.upsert({
      where: {
        userId: session.user.id,
      },
      update: posterData,
      create: {
        ...posterData,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return await transaction.class.create({
      data: {
        name: data.name,
        Posters: {
          connect: {
            id: poster.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    })
  })
})
