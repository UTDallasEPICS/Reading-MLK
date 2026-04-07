import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = event.context.params?.id

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
    })
  }

  const studentId = Number(id)

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
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    return student
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        name: body.name ?? student.name,
        settings: body.settings ?? student.settings,
        exp: body.exp ?? student.exp,
      },
    })

    return updatedStudent
  }

  if (method === 'DELETE') {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    await prisma.student.delete({
      where: {
        id: studentId,
      },
    })

    return { message: 'Student deleted successfully' }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})