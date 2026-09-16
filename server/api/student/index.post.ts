import { prisma } from '../../utils/prisma'
import { studentCreateSchema } from '../../utils/schemas'
import { requireSession } from '../../utils/require-session'
import { enrollInMlkClass } from '../../utils/mlk-class'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const body = studentCreateSchema.safeParse(await readBody(event))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    })
  }

  const newStudent = await prisma.student.create({
    data: {
      name: body.data.name,
      parentUserId: session.user.id,
      settings: { dyslexiaFont: false, language: 'en', fontSize: 1 },
    },
  })

  // Automatically enroll every new student in the Friends of MLK class
  // so they always see the admin-managed forms regardless of other class memberships.
  await enrollInMlkClass(newStudent.id)

  return newStudent
})
