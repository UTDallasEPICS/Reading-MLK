import { Prisma } from '~~/prisma/generated/client'
import { auth } from '~~/server/utils/auth'
import { prisma } from '~~/server/utils/prisma'
import { getQuery, setResponseStatus, type H3Event } from 'h3'

type ActionName =
  | 'listFormGroups'
  | 'getOnlyActiveFormsinGroup'
  | 'getFormGroup'
  | 'resolveFormGroupRangeByDate'
  | 'getFormGroupSubmissions'
  | 'listForms'
  | 'createFormGroup'
  | 'createForm'
  | 'createComponent'
  | 'updateFormGroup'
  | 'updateForm'
  | 'updateComponent'
  | 'deleteFormGroup'
  | 'deleteForm'
  | 'deleteComponent'

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const hasOwnField = (value: Record<string, unknown> | null, key: string) =>
  Object.prototype.hasOwnProperty.call(value ?? {}, key)

const normalizeScalar = (value: unknown) => (Array.isArray(value) ? value[0] : value)

const toInt = (value: unknown, fieldName: string, required = true): number | null => {
  const normalized = normalizeScalar(value)

  if (normalized === undefined || normalized === null || normalized === '') {
    if (required) {
      throw createError({ statusCode: 400, statusMessage: `${fieldName} is required` })
    }

    return null
  }

  const parsed = typeof normalized === 'number' ? normalized : Number(normalized)

  if (!Number.isInteger(parsed)) {
    throw createError({ statusCode: 400, statusMessage: `${fieldName} must be an integer` })
  }

  return parsed
}

const toDate = (value: unknown, fieldName: string, required = true): Date | null => {
  const normalized = normalizeScalar(value)

  if (normalized === undefined || normalized === null || normalized === '') {
    if (required) {
      throw createError({ statusCode: 400, statusMessage: `${fieldName} is required` })
    }

    return null
  }

  const parsed = new Date(String(normalized))

  if (Number.isNaN(parsed.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `${fieldName} must be a valid date` })
  }

  return parsed
}

const toBoolean = (value: unknown) => {
  const normalized = normalizeScalar(value)

  return normalized === true || normalized === 'true' || normalized === 1 || normalized === '1'
}

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

const findMatchingFormGroupByDate = async (date: Date) => {
  return await prisma.formGroup.findFirst({
    where: {
      startDate: { lte: date },
      OR: [
        { endDate: null },
        { endDate: { gte: date } },
      ],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    select: { id: true, startDate: true, endDate: true },
  })
}

const getAction = (event: H3Event, body: Record<string, unknown> | null) => {
  const query = getQuery(event)
  return (query.action ?? body?.action) as ActionName | undefined
}

const isFormApiDevBypassEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.FORM_API_DEV_BYPASS === 'true'

const requireAdminSession = async (event: H3Event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session) {
    if (isFormApiDevBypassEnabled()) {
      return { session: null, userId: null, admin: null, bypassed: true }
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: no active session. Log in, or set FORM_API_DEV_BYPASS=true for local testing only.',
    })
  }

  const userId = normalizeScalar(session.user.id)

  if (!userId || typeof userId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid session user id' })
  }

  const admin = await prisma.admin.findUnique({
    where: { userId },
  })

  if (!admin) {
    if (isFormApiDevBypassEnabled()) {
      return { session, userId, admin: null, bypassed: true }
    }

    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: current user is not an admin.',
    })
  }

  return { session, userId, admin, bypassed: false }
}

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
    author: string | number | null
    formGroup: number
    title?: string | null
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

const formGroupInclude = {
  RaffleWinner: true,
  Forms: {
    orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
    include: {
      Components: {
        orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
      },
    },
  },
}

const formInclude = {
  Components: {
    orderBy: [{ order: 'asc' as const }, { id: 'asc' as const }],
  },
  FormGroup: true,
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method ?? 'GET'
  const body = method === 'GET' ? null : ((await readBody(event).catch(() => null)) as Record<string, unknown> | null)
  const action = getAction(event, body)

  if (method !== 'GET' && !action) { throw createError({ statusCode: 400, statusMessage: 'Missing action' }) }

  if (method === 'GET') {
    const selectedAction = action ?? 'listFormGroups'

    if (selectedAction === 'listFormGroups') {
      const groups = await prisma.formGroup.findMany({
        orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
        include: formGroupInclude,
      })

      return groups.map((group) => ({
        id: group.id,
        startDate: formatIsoDate(group.startDate),
        endDate: formatIsoDate(group.endDate),
        raffleWinner: group.raffleWinner,
        raffleWinnerStudent: group.RaffleWinner,
        forms: group.Forms.map((form) => mapForm(form, group.startDate)),
      }))
    }

    if (selectedAction === 'getFormGroup') {
      const groupId = toInt(getQuery(event).id, 'id')

      const group = await prisma.formGroup.findUnique({
        where: { id: groupId as number },
        include: formGroupInclude,
      })

      if (!group) {
        throw createError({ statusCode: 404, statusMessage: 'Form group not found' })
      }

      return {
        id: group.id,
        startDate: formatIsoDate(group.startDate),
        endDate: formatIsoDate(group.endDate),
        raffleWinner: group.raffleWinner,
        raffleWinnerStudent: group.RaffleWinner,
        forms: group.Forms.map((form) => mapForm(form, group.startDate)),
      }
    }

    if (selectedAction === 'listForms') {
      const query = getQuery(event)
      const formGroupId = query.formGroup !== undefined ? toInt(query.formGroup, 'formGroup', false) : null
      const weeklyDate =
        query.weeklyDate !== undefined && query.weeklyDate !== null && query.weeklyDate !== ''
          ? (toDate(query.weeklyDate, 'weeklyDate') as Date)
          : null

      const where: Prisma.FormWhereInput = {}

      if (formGroupId !== null) { where.formGroup = formGroupId }

      if (weeklyDate) {
        const matchingGroup = await findMatchingFormGroupByDate(weeklyDate)

        if (!matchingGroup) {
          return []
        }

        where.formGroup = matchingGroup.id
        where.startDate = matchingGroup.endDate
          ? { gte: matchingGroup.startDate, lte: matchingGroup.endDate }
          : { gte: matchingGroup.startDate }
      }

      if (query.published) { where.published = toBoolean(query.published) }

      const forms = await prisma.form.findMany({
        where,
        orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
        include: formInclude,
      })

      return forms.map((form) => mapForm(form, form.FormGroup.startDate))
    }

    if (selectedAction === 'resolveFormGroupRangeByDate') {
      const weeklyDate = toDate(getQuery(event).weeklyDate, 'weeklyDate') as Date
      const matchingGroup = await findMatchingFormGroupByDate(weeklyDate)

      if (!matchingGroup) {
        return {
          found: false,
          formGroupId: null,
          startDate: null,
          endDate: null,
        }
      }

      return {
        found: true,
        formGroupId: matchingGroup.id,
        startDate: formatIsoDate(matchingGroup.startDate),
        endDate: formatIsoDate(matchingGroup.endDate),
      }
    }

    if (selectedAction === 'getFormGroupSubmissions') {
      const formGroupId = toInt(getQuery(event).formGroupId, 'formGroupId')

      const forms = await prisma.form.findMany({
        where: { formGroup: formGroupId as number },
        select: { id: true },
      })

      const formIds = forms.map((f) => f.id)

      if (formIds.length === 0) {
        return { submissions: [], totalEntries: 0 }
      }

      const submissions = await prisma.formSubmission.findMany({
        where: { form: { in: formIds } },
        include: {
          Student: true,
          Form: { select: { id: true, title: true, startDate: true } },
        },
      })

      return {
        submissions: submissions.map((sub) => ({
          id: sub.id,
          studentId: sub.student,
          studentName: sub.Student.name,
          formId: sub.form,
          formTitle: sub.Form.title ?? `Form ${sub.Form.id}`,
          submissionDate: sub.submissionDate.toISOString(),
        })),
        totalEntries: submissions.length,
      }
    }

    if (selectedAction === 'getOnlyActiveFormsinGroup') {
      const query = getQuery(event)
      const where: Prisma.FormWhereInput = {}

      if (query.formGroup !== null) { where.formGroup = Number(query.formGroup) }

      if (query.published) { where.published = toBoolean(query.published) }

      return await prisma.form.findMany({
        where,
        orderBy: [{ formGroup: 'asc' }, { order: 'asc' }, { id: 'asc' }],
      })
    }


    throw createError({ statusCode: 400, statusMessage: 'Unknown action' })
  }



  const { admin } = await requireAdminSession(event)

  if (method === 'POST') {
    if (action === 'createFormGroup') {
      const startDate = toDate(body?.startDate, 'startDate')
      const endDate = hasOwnField(body, 'endDate') ? toDate(body?.endDate, 'endDate', false) : null
      const raffleWinner = hasOwnField(body, 'raffleWinner') ? toInt(body?.raffleWinner, 'raffleWinner', false) : null

      if (raffleWinner !== null) {
        const student = await prisma.student.findUnique({
          where: { id: raffleWinner },
          select: { id: true },
        })

        if (!student) {
          throw createError({ statusCode: 404, statusMessage: 'Raffle winner student not found' })
        }
      }

      const created = await prisma.formGroup.create({
        data: {
          startDate: startDate as Date,
          endDate,
          raffleWinner,
        },
        include: formGroupInclude,
      })

      setResponseStatus(event, 201)

      return {
        success: true,
        message: 'Form group created',
        data: {
          id: created.id,
          startDate: formatIsoDate(created.startDate),
          endDate: formatIsoDate(created.endDate),
          raffleWinner: created.raffleWinner,
          raffleWinnerStudent: created.RaffleWinner,
          forms: created.Forms.map((form) => mapForm(form, created.startDate)),
        },
      }
    }

    if (action === 'createForm') {
      const startDate = toDate(body?.startDate, 'startDate') as Date
      const endDate = hasOwnField(body, 'endDate') ? toDate(body?.endDate, 'endDate', false) : null
      const published = hasOwnField(body, 'published') ? toBoolean(body?.published) : false
      const title = hasOwnField(body, 'title') ? String(body?.title ?? '').trim() || null : null
      const explicitOrder = hasOwnField(body, 'order') ? toInt(body?.order, 'order', false) : null
      const requestedGroupId = hasOwnField(body, 'formGroup')
        ? toInt(body?.formGroup, 'formGroup', false)
        : null

      let resolvedFormGroupId: number

      if (requestedGroupId !== null) {
        const requestedGroup = await prisma.formGroup.findUnique({
          where: { id: requestedGroupId },
          select: { id: true },
        })

        resolvedFormGroupId = requestedGroup
          ? requestedGroup.id
          : await findOrCreateWeeklyFormGroup(startDate)
      } else {
        resolvedFormGroupId = await findOrCreateWeeklyFormGroup(startDate)
      }

      const existingMax = await prisma.form.aggregate({
        where: { formGroup: resolvedFormGroupId },
        _max: { order: true },
      })

      const createData: Record<string, unknown> = {
          formGroup: resolvedFormGroupId,
          startDate,
          endDate,
          published,
          order: explicitOrder ?? ((existingMax._max.order ?? -1) + 1),
          author: admin?.id ?? null,
      }

      if (title !== null) {
        createData.title = title
      }

      const created = await prisma.form.create({
        data: createData as Prisma.FormUncheckedCreateInput,
        include: formInclude,
      })

      setResponseStatus(event, 201)

      return {
        success: true,
        message: 'Form created',
        data: mapForm(created, created.FormGroup.startDate),
      }
    }

    if (action === 'createComponent') {
      const form = toInt(body?.form, 'form')
      const questionType = String(body?.questionType ?? '').trim()
      const questionText = String(body?.questionText ?? '').trim()

      if (!questionType) {
        throw createError({ statusCode: 400, statusMessage: 'questionType is required' })
      }

      if (!questionText) {
        throw createError({ statusCode: 400, statusMessage: 'questionText is required' })
      }

      const parentForm = await prisma.form.findUnique({
        where: { id: form as number },
        select: { id: true },
      })

      if (!parentForm) {
        throw createError({ statusCode: 404, statusMessage: 'Form not found' })
      }

      const explicitOrder = hasOwnField(body, 'order') ? toInt(body?.order, 'order', false) : null

      const existingMax = await prisma.formComponent.aggregate({
        where: { form: form as number },
        _max: { order: true },
      })

      const created = await prisma.formComponent.create({
        data: {
          form: form as number,
          order: explicitOrder ?? ((existingMax._max.order ?? -1) + 1),
          questionType,
          questionText,
          questionOptions: toOptionalJson(body?.questionOptions) ?? null,
        },
      })

      setResponseStatus(event, 201)

      return {
        success: true,
        message: 'Form component created',
        data: mapComponent(created),
      }
    }

    throw createError({ statusCode: 400, statusMessage: 'Unknown action' })
  }

  if (method === 'PUT') {
    if (action === 'updateFormGroup') {
      const id = toInt(body?.id, 'id')
      const data: {
        startDate?: Date
        endDate?: Date | null
        raffleWinner?: number | null
      } = {}

      if (hasOwnField(body, 'startDate')) {
        data.startDate = toDate(body?.startDate, 'startDate') as Date
      }

      if (hasOwnField(body, 'endDate')) {
        data.endDate = toDate(body?.endDate, 'endDate', false)
      }

      if (hasOwnField(body, 'raffleWinner')) {
        const raffleWinner = toInt(body?.raffleWinner, 'raffleWinner', false)

        if (raffleWinner !== null) {
          const student = await prisma.student.findUnique({
            where: { id: raffleWinner },
            select: { id: true },
          })

          if (!student) {
            throw createError({ statusCode: 404, statusMessage: 'Raffle winner student not found' })
          }
        }

        data.raffleWinner = raffleWinner
      }

      const updated = await prisma.formGroup.update({
        where: { id: id as number },
        data,
        include: formGroupInclude,
      })

      return {
        success: true,
        message: 'Form group updated',
        data: {
          id: updated.id,
          startDate: formatIsoDate(updated.startDate),
          endDate: formatIsoDate(updated.endDate),
          raffleWinner: updated.raffleWinner,
          raffleWinnerStudent: updated.RaffleWinner,
          forms: updated.Forms.map((form) => mapForm(form, updated.startDate)),
        },
      }
    }

    if (action === 'updateForm') {
      const id = toInt(body?.id, 'id')
      const data: {
        formGroup?: number
        startDate?: Date
        endDate?: Date | null
        published?: boolean
        order?: number
        title?: string | null
      } = {}

      if (hasOwnField(body, 'formGroup')) {
        const formGroup = toInt(body?.formGroup, 'formGroup')
        const group = await prisma.formGroup.findUnique({
          where: { id: formGroup as number },
          select: { id: true },
        })

        if (!group) {
          throw createError({ statusCode: 404, statusMessage: 'Form group not found' })
        }

        data.formGroup = formGroup as number
      }

      if (hasOwnField(body, 'startDate')) {
        data.startDate = toDate(body?.startDate, 'startDate') as Date
      }

      if (hasOwnField(body, 'endDate')) {
        data.endDate = toDate(body?.endDate, 'endDate', false)
      }

      if (hasOwnField(body, 'published')) {
        data.published = toBoolean(body?.published)
      }

      if (hasOwnField(body, 'order')) {
        data.order = toInt(body?.order, 'order') as number
      }

      if (hasOwnField(body, 'title')) {
        const title = String(body?.title ?? '').trim()
        data.title = title || null
      }

      const updated = await prisma.form.update({
        where: { id: id as number },
        data: data as Prisma.FormUncheckedUpdateInput,
        include: formInclude,
      })

      return {
        success: true,
        message: 'Form updated',
        data: mapForm(updated, updated.FormGroup.startDate),
      }
    }

    if (action === 'updateComponent') {
      const id = toInt(body?.id, 'id')
      const data: Prisma.FormComponentUpdateInput = {}

      if (hasOwnField(body, 'form')) {
        const form = toInt(body?.form, 'form')
        const parentForm = await prisma.form.findUnique({
          where: { id: form as number },
          select: { id: true },
        })

        if (!parentForm) {
          throw createError({ statusCode: 404, statusMessage: 'Form not found' })
        }

        data.Form = {
          connect: { id: form as number },
}
      }

      if (hasOwnField(body, 'order')) {
        data.order = toInt(body?.order, 'order') as number
      }

      if (hasOwnField(body, 'questionType')) {
        const questionType = String(body?.questionType ?? '').trim()

        if (!questionType) {
          throw createError({ statusCode: 400, statusMessage: 'questionType is required' })
        }

        data.questionType = questionType
      }

      if (hasOwnField(body, 'questionText')) {
        const questionText = String(body?.questionText ?? '').trim()

        if (!questionText) {
          throw createError({ statusCode: 400, statusMessage: 'questionText is required' })
        }

        data.questionText = questionText
      }

      if (hasOwnField(body, 'questionOptions')) {
        data.questionOptions = toOptionalJson(body?.questionOptions)
      }

      const updated = await prisma.formComponent.update({
        where: { id: id as number },
        data,
      })

      return {
        success: true,
        message: 'Form component updated',
        data: mapComponent(updated),
      }
    }

    throw createError({ statusCode: 400, statusMessage: 'Unknown action' })
  }

  if (method === 'DELETE') {
    if (action === 'deleteFormGroup') {
      const id = toInt(body?.id ?? getQuery(event).id, 'id')

      await prisma.formGroup.delete({
        where: { id: id as number },
      })

      return {
        success: true,
        message: 'Form group deleted',
      }
    }

    if (action === 'deleteForm') {
      const id = toInt(body?.id ?? getQuery(event).id, 'id')

      await prisma.form.delete({
        where: { id: id as number },
      })

      return {
        success: true,
        message: 'Form deleted',
      }
    }

    if (action === 'deleteComponent') {
      const id = toInt(body?.id ?? getQuery(event).id, 'id')

      await prisma.formComponent.delete({
        where: { id: id as number },
      })

      return {
        success: true,
        message: 'Form component deleted',
      }
    }

    throw createError({ statusCode: 400, statusMessage: 'Unknown action' })
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
