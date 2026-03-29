import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const students = await prisma.student.findMany()
    return students
  }

  if (method === 'POST') {
    const body = await readBody(event)

    await prisma.student.create({
      data: {
        name: body.name,
        parent: Number(body.parent),
      }
    })
  }
})