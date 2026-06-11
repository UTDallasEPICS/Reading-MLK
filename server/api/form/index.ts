import { Prisma } from '~~/prisma/generated/client'
import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { getQuery, setResponseStatus, type H3Event } from 'h3'
import {z } from 'zod'

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const hasOwnField = (value: Record<string, unknown> | null, key: string) =>
  Object.prototype.hasOwnProperty.call(value ?? {}, key)

const normalizeScalar = (value: unknown) => (Array.isArray(value) ? value[0] : value)

const toOptionalJson = (value: unknown) => {
  if (value === undefined) {
    return undefined
  }

  const normalized = normalizeScalar(value)

  if (typeof normalized === 'string') {
    try {
      return JSON.parse(normalized)
    } catch {
      return normalized
    }
  }

  return normalized
}

const formatIsoDate = (value: Date | null | undefined) => (value ? value.toISOString() : null)

const formatDayName = (value: Date | null | undefined) => {
  if (!value) {
    return ''
  }

  return WEEKDAY_NAMES[value.getUTCDay()]
}

const formatDisplayDate = (value: Date | null | undefined) => {
  if (!value) {
    return ''
  }

  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getWeekBoundsUtc = (date: Date) => {
  const normalizedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const daysSinceMonday = (normalizedDate.getUTCDay() + 6) % 7

  const monday = new Date(normalizedDate)
  monday.setUTCDate(normalizedDate.getUTCDate() - daysSinceMonday)
  monday.setUTCHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)
  sunday.setUTCHours(23, 59, 59, 999)

  return { monday, sunday }
}

const findOrCreateWeeklyFormGroup = async (date: Date) => {
  const { monday, sunday } = getWeekBoundsUtc(date)

  const existingGroup = await prisma.formGroup.findFirst({
    where: {
      OR: [
        {
          startDate: monday,
        },
        {
          startDate: { lte: date },
          OR: [{ endDate: null }, { endDate: { gte: date } }],
        },
      ],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    select: { id: true },
  })

  if (existingGroup) {
    return existingGroup.id
  }

  const createdGroup = await prisma.formGroup.create({
    data: {
      startDate: monday,
      endDate: sunday,
    },
    select: { id: true },
  })

  return createdGroup.id
}

const getAction = (event: H3Event, body: Record<string, unknown> | null) => {
  const query = getQuery(event)
  return (query.action ?? body?.action) as ActionName | undefined
}

const isFormApiDevBypassEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.FORM_API_DEV_BYPASS === 'true'

const mapComponent = (component: {
  id: number
  form: number
  order: number
  questionType: string
  questionText: string
  questionOptions: unknown
}) => ({
  id: component.id,
  form: component.form,
  order: component.order,
  questionType: component.questionType,
  type: component.questionType,
  questionText: component.questionText,
  text: component.questionText,
  questionOptions: component.questionOptions ?? null,
  choices: component.questionOptions ?? null,
})

const mapForm = (
  form: {
    id: number
    order: number
    startDate: Date
    endDate: Date | null
    published: boolean
    author: string
    formGroup: number
    title: string
    Components?: Array<{
      id: number
      form: number
      order: number
      questionType: string
      questionText: string
      questionOptions: unknown
    }>
  },
  groupStartDate?: Date
) => {
  const startDate = form.startDate ? new Date(form.startDate) : null
  const weekStart = groupStartDate ? new Date(groupStartDate) : null

  return {
    id: form.id,
    order: form.order,
    startDate: formatIsoDate(startDate),
    endDate: formatIsoDate(form.endDate),
    published: form.published,
    author: form.author,
    formGroup: form.formGroup,
    status: form.published ? 'Active' : 'Unpublished',
    day: formatDayName(startDate),
    weekStart: weekStart ? weekStart.toISOString().slice(0, 10) : '',
    date: formatDisplayDate(startDate),
    title: form.title ?? `Form ${form.id}`,
    questions: (form.Components ?? [])
      .slice()
      .sort((left, right) => left.order - right.order)
      .map(mapComponent),
  }
}

export default defineEventHandler(async (event) => {})
