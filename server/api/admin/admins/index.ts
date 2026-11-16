import { z } from 'zod'
import { emailSchema } from '../../../utils/schemas'
import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/require-session'
import { isMasterAdmin } from '../../../utils/master-admin'

const createAdminSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: emailSchema,
})

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)
  const canCreateAdmins = process.env.NODE_ENV !== 'production' || isMasterAdmin(session.user.email)

  if (event.node.req.method === 'GET') {
    if (!canCreateAdmins) {
      return { canCreateAdmins, admins: [] }
    }

    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    })

    const admins = adminUsers.map((admin) => ({
      ...admin,
      isMaster: isMasterAdmin(admin.email),
    }))

    return { canCreateAdmins, admins }
  }

  if (event.node.req.method !== 'POST' && event.node.req.method !== 'PATCH') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  if (!canCreateAdmins) {
    throw createError({ statusCode: 403, statusMessage: 'Only the master admin can manage admin accounts' })
  }

  if (event.node.req.method === 'PATCH') {
    const parsed = z.object({ id: z.string().min(1) }).safeParse(await readBody(event))
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'A valid admin ID is required' })
    }

    if (parsed.data.id === session.user.id) {
      throw createError({ statusCode: 400, statusMessage: 'You cannot remove your own admin privilege' })
    }

    const target = await prisma.user.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, email: true, role: true },
    })

    if (!target || target.role !== 'admin') {
      throw createError({ statusCode: 404, statusMessage: 'Admin account not found' })
    }

    if (isMasterAdmin(target.email)) {
      throw createError({ statusCode: 400, statusMessage: 'The master admin privilege cannot be removed' })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: target.id },
        data: { role: 'coach' },
      }),
      prisma.session.deleteMany({
        where: { userId: target.id },
      }),
    ])

    return { success: true }
  }

  const parsed = createAdminSchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid admin information',
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  })

  if (existingUser) {
    throw createError({ statusCode: 409, statusMessage: 'A user with this email already exists' })
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: 'admin',
      emailVerified: false,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  })

  return { success: true, user }
})
