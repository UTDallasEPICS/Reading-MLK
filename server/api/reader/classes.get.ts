import { prisma } from '../../utils/prisma'
import { requireSession } from '../../utils/require-session'
import { getMlkClass, MLK_CLASS_ID } from '../../utils/mlk-class'

/**
 * GET /api/reader/classes?studentId=<number>
 *
 * Returns all classes the given student belongs to, each with:
 *  - Active form groups (forms that are published and whose group is currently active)
 *  - Per-class ticket count (# of forms the student has submitted in active groups)
 *
 * The Friends of MLK class is always included (auto-enrolled) and is
 * flagged with `isFriendsOfMLK: true`.
 *
 * Auth: logged-in session; student must belong to the calling user.
 */
export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const query = getQuery(event)
  const studentId = typeof query.studentId === 'string' ? Number(query.studentId) : NaN

  if (!studentId || Number.isNaN(studentId)) {
    throw createError({ statusCode: 400, statusMessage: 'studentId is required' })
  }

  // Verify the student belongs to the session user
  const student = await prisma.student.findFirst({
    where: { id: studentId, parentUserId: session.user.id },
    select: { id: true },
  })

  if (!student) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Ensure the MLK class exists and this student is enrolled
  const mlkClass = await getMlkClass()

  // Enroll silently if not already a member (idempotent)
  await prisma.class.update({
    where: { id: mlkClass.id },
    data: { Students: { connect: { id: studentId } } },
  })

  const now = new Date()

  // Fetch all classes for this student with their active form groups and forms
  const classes = await prisma.class.findMany({
    where: {
      Students: { some: { id: studentId } },
    },
    select: {
      id: true,
      joinToken: true,
      name: true,
      FormGroups: {
        where: {
          startDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          Forms: {
            where: { published: true },
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
            select: {
              id: true,
              order: true,
              startDate: true,
              endDate: true,
              published: true,
              formGroup: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  if (classes.length === 0) {
    return []
  }

  // Collect all form IDs across all active groups for this student so we can
  // check completions in a single query
  const allFormIds = classes.flatMap((cls) =>
    cls.FormGroups.flatMap((fg) => fg.Forms.map((f) => f.id))
  )

  // Fetch all submissions by this student for the relevant forms
  const submissions = allFormIds.length > 0
    ? await prisma.formSubmission.findMany({
        where: { student: studentId, form: { in: allFormIds } },
        select: { form: true },
      })
    : []

  const submittedFormIds = new Set(submissions.map((s) => s.form))

  // Build the response
  return classes.map((cls) => {
    const isFriendsOfMLK = cls.id === MLK_CLASS_ID

    const activeFormGroups = cls.FormGroups.map((fg) => ({
      id: fg.id,
      startDate: fg.startDate.toISOString(),
      endDate: fg.endDate ? fg.endDate.toISOString() : null,
      forms: fg.Forms.map((f) => ({
        id: f.id,
        order: f.order,
        startDate: f.startDate.toISOString(),
        endDate: f.endDate ? f.endDate.toISOString() : null,
        published: f.published,
        formGroup: f.formGroup,
        title: f.title,
        completed: submittedFormIds.has(f.id),
      })),
    }))

    const ticketCount = activeFormGroups
      .flatMap((fg) => fg.forms)
      .filter((f) => f.completed).length

    return {
      id: cls.id,
      joinToken: cls.joinToken,
      name: cls.name,
      isFriendsOfMLK,
      activeFormGroups,
      ticketCount,
    }
  })
})
