import { prisma } from '../../utils/prisma'
import { requireCoach } from '../../utils/require-session'
import { classCreateSchema } from '../../utils/schemas'

const coachTagByClassType = {
  Teacher: 'teacher',
  'Study Group': 'studygroup',
  'Community Group': 'other',
  Other: 'other',
} as const

const classCodeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

async function createClassCode() {
  let code = ''

  do {
    code = Array.from({ length: 5 }, () =>
      classCodeCharacters[Math.floor(Math.random() * classCodeCharacters.length)]
    ).join('')
  } while (await prisma.class.findUnique({ where: { joinToken: code } }))

  return code
}

export default defineEventHandler(async (event) => {
  const session = await requireCoach(event)

  const parsed = classCreateSchema.safeParse(await readBody(event))

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid class information',
    })
  }

  const data = parsed.data
  const joinToken = await createClassCode()
  const coachData = {
    tag: coachTagByClassType[data.type],
    school: data.school || null,
    district: data.district || null,
    zipcode: data.zipcode || null,
  }

  return await prisma.$transaction(async (transaction) => {
    const coach = await transaction.coach.upsert({
      where: {
        userId: session.user.id,
      },
      update: {},
      create: {
        ...coachData,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return await transaction.class.create({
      data: {
        name: data.name,
        joinToken,
        Coach: {
          connect: {
            id: coach.id,
          },
        },
      },
      select: {
        joinToken: true,
        name: true,
      },
    })
  })
})
