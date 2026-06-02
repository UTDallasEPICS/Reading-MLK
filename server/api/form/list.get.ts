import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import { formInclude } from '../../utils/inclusions'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  //requireSessions
  //finish coercion for query params
  const formGroupId = z.int().safeParse(query.formGroupId).data
  const weeklyDate = z.coerce.date().safeParse(query.weeklyDate).data
  const published = z.boolean().safeParse(query.published).data

  const where: Prisma.FormWhereInput = {}

  if (formGroupId !== null) { where.formGroup = formGroupId }

  //split into two handlers? one for date matching an
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

  if (published) {where.published = published}

  const forms = await prisma.form.findMany({
    where,
    orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    include: formInclude,
  })

  return forms
})

  