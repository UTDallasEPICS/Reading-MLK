import { prisma } from '../../utils/prisma'
import { studentCreateSchema } from '../../utils/schemas'
import { requireSession } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const body = studentCreateSchema.safeParse(await readBody(event))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    })
  }

  return await prisma.student.create({
    data: {
      name: body.data.name,
      parentUserId: session.user.id,
      settings: { dyslexiaFont: false, language: 'en', fontSize: 1 },
    },
  })
})
