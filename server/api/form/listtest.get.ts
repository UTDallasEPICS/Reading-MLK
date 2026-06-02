import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import { formInclude } from '../../utils/inclusions'


export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where: Prisma.FormWhereInput = {}

    if (query.formGroup) { where.formGroup = Number(query.formGroup) }

    if (query.published) { where.published = z.coerce.boolean().parse(query.published) }
      return await prisma.form.findMany({
        where,
        orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
      })
})