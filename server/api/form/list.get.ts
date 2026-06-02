import { prisma } from '../../utils/prisma' 
import { Prisma } from '~~/prisma/generated/client'
import { getQuery, createError } from 'h3'
import { requireAdmin, requireSession } from '../../utils/require-session'  
import z from 'zod'
import { formInclude } from '../../utils/inclusions'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  //requireSessions
  //fix type casting
  const formGroupId = z.coerce.number().safeParse(query.formGroupId).data
  const weeklyDate = z.coerce.date().safeParse(query.weeklyDate).data
  const published = query.published?.toString

  const where: Prisma.FormWhereInput = {}

  console.log("formGroupId after filtering", formGroupId)
  console.log("\nweeklyDate after filtering", weeklyDate)
  console.log("\npublished after filtering", published)

  //if (published) {where.published = published}

  if (formGroupId) {
    console.log('Filtering forms by formGroupId:', formGroupId)
    where.formGroup = formGroupId}

  else if (weeklyDate) {
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

  