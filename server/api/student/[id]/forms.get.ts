import { prisma } from '../../../utils/prisma'
import { requireSession } from '../../../utils/require-session'

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const studentId = Number(event.context.params?.id)

  if (!Number.isInteger(studentId) || studentId < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' })
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { Classes: { select: { id: true, name: true } } },
  })

  if (!student) {
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }

  const now = new Date()
  const classId = typeof getQuery(event).classId === 'string' ? String(getQuery(event).classId) : null

  if (classId && classId !== 'all' && !student.Classes.some((classroom) => classroom.id === classId)) {
    throw createError({ statusCode: 403, statusMessage: 'Student is not in this class' })
  }

  const groups = await prisma.formGroup.findMany({
    where: {
      ...(classId === 'all'
        ? {}
        : {
            class: classId
              ? classId
              : { in: student.Classes.map((classroom) => classroom.id) },
          }),
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
    orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
    include: {
      Forms: {
        where: { published: true },
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
    classes: student.Classes,
    selectedClassId: classId,
    activeFormGroup: groups[0] ?? null,
    forms,
    formComponents: Object.fromEntries(forms.map((form) => [form.id, form.Components])),
  }
})