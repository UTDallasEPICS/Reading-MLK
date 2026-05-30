import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { studentCreateSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  if (method === 'GET') {
    const students = await prisma.student.findMany({
      where: {
        parentUserId: session.user.id,
      },
    })

    return students
  } else if (method === 'POST') {
    const body = studentCreateSchema.safeParse(await readBody(event))

    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: body.error.message,
      })
    }

    const student = await prisma.student.create({
      data: {
        name: body.data.name,
        parentUserId: session.user.id,
      },
    })

    return student
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})