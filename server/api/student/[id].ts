import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = event.context.params?.id
  
  //validate id path parameter
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
    })
  }
  const studentId = Number(id)

  if (method === 'GET') {

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
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

  if (method === 'PUT') {}

  if (method === 'DELETE') {}

})