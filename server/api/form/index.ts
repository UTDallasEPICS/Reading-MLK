import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event) 

  //GET /api/form?formGroup=1&published=true to get published forms for a specific form group
  if (method === 'GET') {
    return await prisma.form.findMany({
      where: query.formGroup ? { formGroup: Number(query.formGroup), published: Boolean(query.published) } : {}
    })
  }
})