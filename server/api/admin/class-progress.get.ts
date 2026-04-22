import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'
import { getQuery } from 'h3'

const formatYmdUtc = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDateUtc = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const parseLocalDate = (dateString: string) => {
  const parts = dateString.split('-')

  if (parts.length !== 3) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid date format',
    })
  }

  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  return new Date(year, month - 1, day)
}

const getWeekBounds = (dateString: string) => {
  const date = parseLocalDate(dateString)
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    mondayYmd: formatYmdUtc(monday),
    sundayYmd: formatYmdUtc(sunday),
  }
}

type ProgressRow = {
  id: number
  studentId: number
  studentName: string
  formGroupId: number
  formGroupLabel: string
  formGroupStartDate: string
  formId: number
  formTitle: string
  dateCompleted: string
  dateCompletedYmd: string
}

type GroupedRow = {
  studentId: number
  studentName: string
  formsCompleted: number
  lastSubmitted: string
  lastSubmittedYmd: string
}

type MissingRow = {
  studentId: number
  studentName: string
  missingFormsCount: number
  missingForms: string[]
  lastSubmitted: string
  lastSubmittedYmd: string
}

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const query = getQuery(event)

  const mode = query.mode === 'missing' ? 'missing' : 'completed'

  const selectedDate =
    typeof query.date === 'string' && query.date.trim() ? query.date.trim() : ''

  const search =
    typeof query.search === 'string' ? query.search.trim().toLowerCase() : ''

  const groupByStudent = query.groupByStudent === 'true'

  const sortKey =
    typeof query.sortKey === 'string' && query.sortKey.trim()
      ? query.sortKey.trim()
      : null

  const sortDirection =
    query.sortDirection === 'asc' || query.sortDirection === 'desc'
      ? query.sortDirection
      : null

  const page =
    typeof query.page === 'string' && !Number.isNaN(Number(query.page))
      ? Math.max(1, Number(query.page))
      : 1

  const pageSize =
    typeof query.pageSize === 'string' && !Number.isNaN(Number(query.pageSize))
      ? Math.max(1, Number(query.pageSize))
      : 10

  let selectedFormIds: number[] = []

  if (typeof query.formIds === 'string' && query.formIds.trim()) {
    selectedFormIds = query.formIds
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value))
  }

  const submissions = await prisma.formSubmission.findMany({
    orderBy: {
      submissionDate: 'desc',
    },
    include: {
      Student: {
        select: {
          id: true,
          name: true,
        },
      },
      Form: {
        select: {
          id: true,
          title: true,
          FormGroup: {
            select: {
              id: true,
              startDate: true,
            },
          },
        },
      },
    },
  })

  let rows: ProgressRow[] = submissions.map((submission) => {
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

  if (selectedDate) {
    const { mondayYmd, sundayYmd } = getWeekBounds(selectedDate)

    rows = rows.filter((row) => {
      return (
        row.formGroupStartDate >= mondayYmd &&
        row.formGroupStartDate <= sundayYmd
      )
    })
  }

  if (selectedFormIds.length > 0) {
    rows = rows.filter((row) => selectedFormIds.includes(row.formId))
  }

  if (mode === 'missing') {
    if (!selectedDate) {
      return {
        mode: 'missing',
        rows: [],
        totalCount: 0,
        totalPages: 1,
        page,
        pageSize,
      }
    }

    const students = await prisma.student.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    })

    const expectedForms = new Map<number, string>()

    for (const row of rows) {
      expectedForms.set(row.formId, row.formTitle)
    }

    let missingRows: MissingRow[] = students.map((student) => {
      const studentRows = rows.filter((row) => row.studentId === student.id)
      const completedIds = new Set(studentRows.map((row) => row.formId))

      const missingForms = Array.from(expectedForms.entries())
        .filter(([formId]) => !completedIds.has(formId))
        .map(([, formTitle]) => formTitle)

      return {
        studentId: student.id,
        studentName: student.name,
        missingFormsCount: missingForms.length,
        missingForms,
        lastSubmitted: studentRows[0]?.dateCompleted ?? '',
        lastSubmittedYmd: studentRows[0]?.dateCompletedYmd ?? '',
      }
    })

    missingRows = missingRows.filter((row) => row.missingFormsCount > 0)

    if (search) {
      missingRows = missingRows.filter((row) =>
        row.studentName.toLowerCase().includes(search)
      )
    }

    if (sortKey && sortDirection) {
      missingRows.sort((a, b) => {
        let comparison = 0

        if (sortKey === 'studentName') {
          comparison = a.studentName.localeCompare(b.studentName)
        } else if (sortKey === 'missingFormsCount') {
          comparison = a.missingFormsCount - b.missingFormsCount
        } else if (sortKey === 'lastSubmitted') {
          comparison = a.lastSubmittedYmd.localeCompare(b.lastSubmittedYmd)
        }

        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    const totalCount = missingRows.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const start = (page - 1) * pageSize
    const paginatedRows = missingRows.slice(start, start + pageSize)

    return {
      mode: 'missing',
      rows: paginatedRows,
      totalCount,
      totalPages,
      page,
      pageSize,
    }
  }

  if (!groupByStudent) {
    if (search) {
      rows = rows.filter((row) =>
        row.studentName.toLowerCase().includes(search)
      )
    }

    if (sortKey && sortDirection) {
      rows.sort((a, b) => {
        let comparison = 0

        if (sortKey === 'studentName') {
          comparison = a.studentName.localeCompare(b.studentName)
        } else if (sortKey === 'formGroupLabel') {
          comparison = a.formGroupStartDate.localeCompare(b.formGroupStartDate)
        } else if (sortKey === 'formTitle') {
          comparison = a.formTitle.localeCompare(b.formTitle)
        } else if (sortKey === 'dateCompleted') {
          comparison = a.dateCompletedYmd.localeCompare(b.dateCompletedYmd)
        }

        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    const totalCount = rows.length
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const start = (page - 1) * pageSize
    const paginatedRows = rows.slice(start, start + pageSize)

    return {
      mode: 'records',
      rows: paginatedRows,
      totalCount,
      totalPages,
      page,
      pageSize,
    }
  }

  if (search) {
    rows = rows.filter((row) =>
      row.studentName.toLowerCase().includes(search)
    )
  }

  const groupedMap = new Map<number, GroupedRow>()

  for (const row of rows) {
    const existing = groupedMap.get(row.studentId)

    if (!existing) {
      groupedMap.set(row.studentId, {
        studentId: row.studentId,
        studentName: row.studentName,
        formsCompleted: 1,
        lastSubmitted: row.dateCompleted,
        lastSubmittedYmd: row.dateCompletedYmd,
      })
      continue
    }

    existing.formsCompleted += 1

    if (row.dateCompletedYmd > existing.lastSubmittedYmd) {
      existing.lastSubmitted = row.dateCompleted
      existing.lastSubmittedYmd = row.dateCompletedYmd
    }
  }

  let groupedRows = Array.from(groupedMap.values())

  if (sortKey && sortDirection) {
    groupedRows.sort((a, b) => {
      let comparison = 0

      if (sortKey === 'studentName') {
        comparison = a.studentName.localeCompare(b.studentName)
      } else if (sortKey === 'formsCompleted') {
        comparison = a.formsCompleted - b.formsCompleted
      } else if (sortKey === 'lastSubmitted') {
        comparison = a.lastSubmittedYmd.localeCompare(b.lastSubmittedYmd)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }

  const totalCount = groupedRows.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const start = (page - 1) * pageSize
  const paginatedRows = groupedRows.slice(start, start + pageSize)

  return {
    mode: 'grouped',
    rows: paginatedRows,
    totalCount,
    totalPages,
    page,
    pageSize,
  }
})