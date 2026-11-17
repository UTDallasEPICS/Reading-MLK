import type { Prisma } from '~~/prisma/generated/client'
import { prisma } from '../../../utils/prisma'
import { requireSession } from '../../../utils/require-session'
import { ensureMlkClassMembership } from '../../../utils/ensure-mlk-class-membership'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const studentId = Number(event.context.params?.id)

  if (!Number.isInteger(studentId) || studentId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' })
  }

  await ensureMlkClassMembership(session.user.id)
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { Classes: { select: { id: true, name: true } } },
  })

  if (!student) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const classes = student.Classes.map((classroom) => ({
    ...classroom,
    isEnrolled: true,
  }))

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const classId = typeof getQuery(event).classId === 'string' ? String(getQuery(event).classId) : null

  if (classId && classId !== 'all' && !student.Classes.some((classroom) => classroom.id === classId)) {
    throw createError({ statusCode: 403, statusMessage: 'Student is not in this class' })
  }

  // Explicit date ranges can span weekly groups. Legacy forms without an end
  // date retain their original group's availability window.
  const availableForms: Prisma.FormWhereInput = {
    published: true,
    OR: [
      { startDate: { lte: now }, endDate: { gte: today } },
      {
        endDate: null,
        FormGroup: {
          startDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      },
    ],
  }

  const groups = await prisma.formGroup.findMany({
    where: {
      class: classId && classId !== 'all'
        ? classId
        : { in: student.Classes.map((classroom) => classroom.id) },
      OR: [
        { startDate: { lte: now }, OR: [{ endDate: null }, { endDate: { gte: now } }] },
        { Forms: { some: availableForms } },
      ],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    include: {
      Forms: {
        where: availableForms,
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: {
          FormGroup: true,
          Components: { orderBy: [{ order: 'asc' }, { id: 'asc' }] },
        },
      },
    },
  })

  const forms = groups.flatMap((group) => group.Forms)

  return {
    classes,
    selectedClassId: classId,
    activeFormGroup: groups[0] ?? null,
    forms,
    formComponents: Object.fromEntries(forms.map((form) => [form.id, form.Components])),
  }
})
