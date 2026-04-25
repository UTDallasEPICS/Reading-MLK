import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { getQuery } from 'h3'

/// Standardizes a UTC date into YYYY-MM-DD string
const formatYmdUtc = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Formats a UTC date for friendly frontend display (e.g., Nov 4, 2024)
const formatDisplayDateUtc = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

// Safely parses YYYY-MM-DD from user input
const parseLocalDate = (dateString: string) => {
  const parts = dateString.split('-')
  if (parts.length !== 3) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format' })
  }
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
}

// Calculates start and end Date objects for a given week. 
// Resolves dates from Monday to Sunday.
const getWeekBoundsDates = (dateString: string) => {
  const date = parseLocalDate(dateString)
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const mondayYmd = formatYmdUtc(monday)
  const sundayYmd = formatYmdUtc(sunday)

  return {
    mondayDate: new Date(`${mondayYmd}T00:00:00.000Z`),
    sundayDate: new Date(`${sundayYmd}T23:59:59.999Z`)
  }
}

// HELPER: Fetches a standard list of individual completed records.
// Queries db directly without pulling extra arrays into memory.
async function getCompletedRecords(queryState: any) {
  const { search, selectedDate, selectedFormIds, sortKey, sortDirection, page, pageSize } = queryState

  const where: any = {}

  // Apply textual search filter directly in db
  if (search) {
    where.Student = { name: { contains: search } }
  }

  // Filter specific forms requested
  if (selectedFormIds.length > 0) {
    where.form = { in: selectedFormIds }
  }

  // Filter timeframe (week)
  if (selectedDate) {
    const { mondayDate, sundayDate } = getWeekBoundsDates(selectedDate)
    where.Form = {
      ...where.Form,
      FormGroup: {
        ...where.Form?.FormGroup,
        startDate: {
          gte: mondayDate,
          lte: sundayDate,
        }
      }
    }
  }

  // Standard or relation-based sorting
  let orderBy: any = { submissionDate: 'desc' }
  if (sortKey && sortDirection) {
    if (sortKey === 'studentName') orderBy = { Student: { name: sortDirection } }
    else if (sortKey === 'formTitle') orderBy = { Form: { title: sortDirection } }
    else if (sortKey === 'dateCompleted') orderBy = { submissionDate: sortDirection }
    else if (sortKey === 'formGroupLabel') orderBy = { Form: { FormGroup: { startDate: sortDirection } } }
  }

  const [totalCount, submissions] = await Promise.all([
    prisma.formSubmission.count({ where }),
    prisma.formSubmission.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        Student: { select: { id: true, name: true } },
        Form: { select: { id: true, title: true, FormGroup: { select: { id: true, startDate: true } } } },
      },
    }),
  ])

  // Transform and flatten for frontend table formats
  const rows = submissions.map((submission) => {
    const groupStart = submission.Form.FormGroup.startDate
    const completedAt = submission.submissionDate
    return {
      id: submission.id,
      studentId: submission.Student.id,
      studentName: submission.Student.name,
      formGroupId: submission.Form.FormGroup.id,
      formGroupLabel: `Week of ${formatDisplayDateUtc(groupStart)}`,
      formGroupStartDate: formatYmdUtc(groupStart),
      formId: submission.Form.id,
      formTitle: submission.Form.title || `Form ${submission.Form.id}`,
      dateCompleted: formatDisplayDateUtc(completedAt),
      dateCompletedYmd: formatYmdUtc(completedAt),
    }
  })

  return { mode: 'records', rows, totalCount }
}

// HELPER: Fetches aggregated count of completions per student.
// Uses native Prisma groupBy over pulling all submissions to minimize overhead.
async function getGroupedRecords(queryState: any) {
  const { search, selectedDate, selectedFormIds, sortKey, sortDirection, page, pageSize } = queryState

  const submissionWhere: any = {}

  if (selectedDate) {
    const { mondayDate, sundayDate } = getWeekBoundsDates(selectedDate)
    submissionWhere.Form = { FormGroup: { startDate: { gte: mondayDate, lte: sundayDate } } }
  }

  if (selectedFormIds.length > 0) {
    submissionWhere.form = { in: selectedFormIds }
  }

  // Aggregation query: count ids and find max submission date
  const grouped = await prisma.formSubmission.groupBy({
    by: ['student'],
    where: {
      ...submissionWhere,
      ...(search ? { Student: { name: { contains: search } } } : {})
    },
    _count: { id: true },
    _max: { submissionDate: true },
  })

  // Map back to students for naming context
  const studentIds = grouped.map((g) => g.student)
  const students = await prisma.student.findMany({
    where: { id: { in: studentIds } },
    select: { id: true, name: true }
  })
  const studentNameMap = new Map(students.map((s) => [s.id, s.name]))

  const rows = grouped.map((g) => {
    const date = g._max.submissionDate!
    return {
      studentId: g.student,
      studentName: studentNameMap.get(g.student) || 'Unknown',
      formsCompleted: g._count.id,
      lastSubmitted: formatDisplayDateUtc(date),
      lastSubmittedYmd: formatYmdUtc(date),
    }
  })

  // Sorting Grouped Arrays
  if (sortKey && sortDirection) {
    rows.sort((a, b) => {
      let comparison = 0
      if (sortKey === 'studentName') comparison = a.studentName.localeCompare(b.studentName)
      else if (sortKey === 'formsCompleted') comparison = a.formsCompleted - b.formsCompleted
      else if (sortKey === 'lastSubmitted') comparison = a.lastSubmittedYmd.localeCompare(b.lastSubmittedYmd)
      return sortDirection === 'asc' ? comparison : -comparison
    })
  } else {
    // Default sorting logic prioritizes studentName
    rows.sort((a, b) => a.studentName.localeCompare(b.studentName))
  }

  const totalCount = rows.length
  return { mode: 'grouped', rows: rows.slice((page - 1) * pageSize, page * pageSize), totalCount }
}

// HELPER: Evaluates expected forms against submitted forms to find what is missing.
async function getMissingRecords(queryState: any) {
  const { search, selectedDate, sortKey, sortDirection, page, pageSize } = queryState

  if (!selectedDate) {
    return { mode: 'missing', rows: [], totalCount: 0 }
  }

  // Calculate only forms that are expected in this specific week
  const { mondayDate, sundayDate } = getWeekBoundsDates(selectedDate)
  const expectedForms = await prisma.form.findMany({
    where: { FormGroup: { startDate: { gte: mondayDate, lte: sundayDate } } },
    select: { id: true, title: true }
  })

  if (expectedForms.length === 0) {
    return { mode: 'missing', rows: [], totalCount: 0 }
  }

  const expectedFormIds = expectedForms.map((f) => f.id)

  const studentWhere: any = {}
  if (search) {
    studentWhere.name = { contains: search }
  }

  // Retrieve student data with only relevant form submissions attached
  const students = await prisma.student.findMany({
    where: studentWhere,
    select: {
      id: true,
      name: true,
      Submissions: {
        where: { form: { in: expectedFormIds } },
        select: { form: true, submissionDate: true },
        orderBy: { submissionDate: 'desc' }
      }
    }
  })

  const rows = []

  // Calculate which explicit forms failed to appear
  for (const student of students) {
    const submittedFormIds = new Set(student.Submissions.map((s) => s.form))
    const missingForms = expectedForms.filter((f) => !submittedFormIds.has(f.id)).map((f) => f.title || `Form ${f.id}`)

    if (missingForms.length > 0) {
      const lastSub = student.Submissions[0]?.submissionDate
      rows.push({
        studentId: student.id,
        studentName: student.name,
        missingFormsCount: missingForms.length,
        missingForms,
        lastSubmitted: lastSub ? formatDisplayDateUtc(lastSub) : '',
        lastSubmittedYmd: lastSub ? formatYmdUtc(lastSub) : '',
      })
    }
  }

  // Missing array sort logic
  if (sortKey && sortDirection) {
    rows.sort((a, b) => {
      let comparison = 0
      if (sortKey === 'studentName') comparison = a.studentName.localeCompare(b.studentName)
      else if (sortKey === 'missingFormsCount') comparison = a.missingFormsCount - b.missingFormsCount
      else if (sortKey === 'lastSubmitted') comparison = a.lastSubmittedYmd.localeCompare(b.lastSubmittedYmd)
      return sortDirection === 'asc' ? comparison : -comparison
    })
  } else {
    // Default sorting logic prioritizes studentName
    rows.sort((a, b) => a.studentName.localeCompare(b.studentName))
  }

  const totalCount = rows.length
  return { mode: 'missing', rows: rows.slice((page - 1) * pageSize, page * pageSize), totalCount }
}

export default defineEventHandler(async (event) => {
  // Admin Authentication Check
  const session = await auth.api.getSession({ headers: event.headers })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Parse Filters and Configs from Frontend
  const query = getQuery(event)
  const mode = query.mode === 'missing' ? 'missing' : 'completed'
  const selectedDate = typeof query.date === 'string' && query.date.trim() ? query.date.trim() : ''
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : ''
  const groupByStudent = query.groupByStudent === 'true'
  const sortKey = typeof query.sortKey === 'string' && query.sortKey.trim() ? query.sortKey.trim() : null
  const sortDirection = query.sortDirection === 'asc' || query.sortDirection === 'desc' ? query.sortDirection : null
  const page = typeof query.page === 'string' && !Number.isNaN(Number(query.page)) ? Math.max(1, Number(query.page)) : 1
  const pageSize = typeof query.pageSize === 'string' && !Number.isNaN(Number(query.pageSize)) ? Math.max(1, Number(query.pageSize)) : 10

  let selectedFormIds: number[] = []
  if (typeof query.formIds === 'string' && query.formIds.trim()) {
    selectedFormIds = query.formIds.split(',').map((value) => Number(value.trim())).filter((value) => Number.isInteger(value))
  }

  const queryState = { search, selectedDate, selectedFormIds, sortKey, sortDirection, page, pageSize }

  // Process Requests to Appropriate Flow
  let result
  if (mode === 'missing') {
    result = await getMissingRecords(queryState)
  } else if (groupByStudent) {
    result = await getGroupedRecords(queryState)
  } else {
    result = await getCompletedRecords(queryState)
  }

  return {
    ...result,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.totalCount / pageSize)),
  }
})