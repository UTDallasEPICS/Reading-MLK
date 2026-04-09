import { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../utils/prisma'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const method = event.node.req.method
    const query = getQuery(event)

    // GET /api/formComponent?form=1 to get components for a specific form
    if (method === 'GET') {
        return await prisma.formComponent.findMany({
            where: query.form ? { form: Number(query.form) } : {},
            orderBy: { order: 'asc' }
        })
    }

})
