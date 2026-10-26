import { prisma } from '../../utils/prisma'
import { studentCreateSchema } from '../../utils/schemas'
import { requireSession } from '../../utils/require-session'
import { ensureMlkClassMembership } from '../../utils/ensure-mlk-class-membership'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const body = studentCreateSchema.safeParse(await readBody(event))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    })
  }

  const defaultClass = await ensureMlkClassMembership(session.user.id)

  return await prisma.student.create({
    data: {
      name: body.data.name,
      parentUserId: session.user.id,
      settings: { dyslexiaFont: false, language: 'en', fontSize: 1 },
      Classes: { connect: { id: defaultClass.id } },
    },
  })
})
