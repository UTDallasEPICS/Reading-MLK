import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') { return await prisma.announcement.findMany() }

  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.announcement.create({
      data: {
        content: body.content,
        postDate: new Date(body.postDate),
        expiryDate: new Date(body.expiryDate),
        author: body.author,
      }
    })
  }
})