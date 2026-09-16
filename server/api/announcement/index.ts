import { prisma } from '../../utils/prisma'
import { getQuery, createError } from 'h3'
import { requireClassAccess, requireSession } from '../../utils/require-session'
import { announcementCreateSchema } from '../../utils/schemas'

// GET /api/announcement?active=true&studentId=<id>  — returns only announcements
// for the classes the given student belongs to (class-specific visibility).
// GET /api/announcement?active=true&classId=<token>  — coach view, scoped to one class.
export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)
  const now = new Date()
  const classToken  = typeof query.classId   === 'string' ? query.classId   : null
  const rawStudentId = typeof query.studentId === 'string' ? Number(query.studentId) : null

  if (method === 'GET') {
    const activeWhere = query.active === 'true'
      ? {
          postDate: { lte: now },
          OR: [{ expiryDate: null }, { expiryDate: { gte: now } }],
        }
      : {}

    // ── Student-scoped: filter to only classes the student belongs to ──────────
    if (rawStudentId && !Number.isNaN(rawStudentId)) {
      const session = await requireSession(event)

      // Security: ensure the student belongs to the calling user
      const student = await prisma.student.findFirst({
        where: { id: rawStudentId, parentUserId: session.user.id },
        select: { id: true, Classes: { select: { id: true } } },
      })

      if (!student) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
      }

      const classIds = student.Classes.map((c) => c.id)

      return await prisma.announcement.findMany({
        where: {
          ...activeWhere,
          class: { in: classIds },
        },
        orderBy: { postDate: 'desc' },
      })
    }

    // ── Coach-scoped: single class via join token ──────────────────────────────
    let classId: string | null = null
    if (classToken) {
      classId = (await requireClassAccess(event, classToken)).classId
    } else {
      await requireSession(event)
    }

    return await prisma.announcement.findMany({
      where: {
        ...activeWhere,
        ...(classId ? { class: classId } : {}),
      },
      orderBy: { postDate: 'desc' },
    })
  }

  if (method === 'POST') {
    const rawBody = await readBody(event)
    const requestedClassId = typeof rawBody?.classId === 'string' ? rawBody.classId : ''

    if (!requestedClassId) {
      throw createError({ statusCode: 400, statusMessage: 'classId is required' })
    }

    const { classId, coachId, session } = await requireClassAccess(event, requestedClassId)
    const body = announcementCreateSchema.safeParse(rawBody)
    
    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: body.error.issues[0]?.message ?? 'Invalid announcement information',
      })
    }

    // When the caller is an admin, requireClassAccess returns the sentinel 'admin'
    // instead of a real Coach.id. Resolve the actual Coach record for this user
    // so the FK constraint on Announcement.author is satisfied.
    let resolvedCoachId = coachId
    if (coachId === 'admin') {
      const coach = await prisma.coach.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
      if (!coach) {
        throw createError({ statusCode: 403, statusMessage: 'Admin user has no Coach profile' })
      }
      resolvedCoachId = coach.id
    }

    return await prisma.announcement.create({
      data: {
        content: body.data.content,
        postDate: body.data.postDate,
        expiryDate: body.data.expiryDate ?? null,
        author: resolvedCoachId,
        class: classId,
      },
    })
  }
})
