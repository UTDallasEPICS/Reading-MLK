import { prisma } from '../../utils/prisma'
import { auth } from '../../utils/auth'

type StudentSettingsShape = {
  theme?: string
  activeAnimations?: string[]
  [key: string]: unknown
}

const sanitizeStudentSettings = async (studentId: number, rawSettings: unknown) => {
  const settings = (rawSettings && typeof rawSettings === 'object'
    ? { ...(rawSettings as StudentSettingsShape) }
    : {}) as StudentSettingsShape

  const items = await prisma.shopItem.findMany({
    include: {
      Theme: {
        select: {
          themeEffect: true,
        },
      },
      Animation: {
        select: {
          animationEffect: true,
        },
      },
      unlockedByStudents: {
        where: { studentId },
        select: { id: true },
      },
    },
  })

  const ownedOrFreeItems = items.filter((item) => item.cost === 0 || item.unlockedByStudents.length > 0)

  const allowedThemes = new Set(
    ownedOrFreeItems
      .filter((item) => item.type === 'theme')
      .map((item) => {
        const effect = item.Theme?.themeEffect
        if (effect && typeof effect === 'object' && 'className' in effect) {
          return String((effect as Record<string, unknown>).className)
        }

        return item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      })
  )

  const allowedAnimations = new Set(
    ownedOrFreeItems
      .filter((item) => item.type === 'animation')
      .map((item) => item.name)
  )

  const requestedTheme = String(settings.theme ?? 'light')
  settings.theme = allowedThemes.has(requestedTheme)
    ? requestedTheme
    : (allowedThemes.has('light') ? 'light' : [...allowedThemes][0] ?? 'light')

  const requestedAnimations = Array.isArray(settings.activeAnimations)
    ? settings.activeAnimations.map((value) => String(value))
    : []
  settings.activeAnimations = requestedAnimations.filter((name) => allowedAnimations.has(name))

  return settings
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = event.context.params?.id

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
    })
  }

  const studentId = Number(id)

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  if (method === 'GET') {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    const sanitizedSettings = await sanitizeStudentSettings(studentId, student.settings)

    return {
      ...student,
      settings: sanitizedSettings,
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event)

    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    const sanitizedSettings = body.settings !== undefined
      ? await sanitizeStudentSettings(studentId, body.settings)
      : student.settings

    const updatedStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        name: body.name ?? student.name,
        settings: sanitizedSettings,
        exp: body.exp ?? student.exp,
      },
    })

    return updatedStudent
  }

  if (method === 'DELETE') {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        parentUserId: session.user.id,
      },
    })

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Student not found',
      })
    }

    await prisma.student.delete({
      where: {
        id: studentId,
      },
    })

    return { message: 'Student deleted successfully' }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})