import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import { formInclude } from '../../utils/prismaInclusions'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  //add requireSessions
  const formGroupId = z.coerce.number().safeParse(query.formGroupId).data
  const weeklyDate = z.coerce.date().safeParse(query.weeklyDate).data
  
  const where: Prisma.FormWhereInput = {}

  //expecting 0/1 for t/f
  if (query.published) {
    const pre = z.coerce.number().safeParse(query.published)
    if (!pre.success) { throw createError({ statusCode: 400, message: 'Invalid published value' })}
    const published = z.coerce.boolean().safeParse(pre.data).data
    where.published = published
  }

  if (formGroupId) {where.formGroup = formGroupId}

  if (weeklyDate) {
    const matchingGroup = await $fetch('/api/formGroup/matchByDate', {
      query: { date: weeklyDate.toISOString() }
    })

    if (!matchingGroup) {
      return []
    }

    where.formGroup = matchingGroup.id
    where.startDate = matchingGroup.endDate
      ? { gte: matchingGroup.startDate, lte: matchingGroup.endDate }
      : { gte: matchingGroup.startDate }
  }

  const forms = await prisma.form.findMany({
    where,
    orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    include: formInclude,
  })

  return forms
})

  