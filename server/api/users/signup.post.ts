import { prisma } from '../../utils/prisma'
import { userCreateSchema } from '../../utils/schemas'
import { ensureMlkClassExists } from '../../utils/ensure-mlk-class-membership'

export default defineEventHandler(async (event) => {
  const body = userCreateSchema.safeParse(await readBody(event))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.data.email },
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists',
    })
  }

  const defaultClass =
    body.data.role === 'reader' ? await ensureMlkClassExists() : null

  const user = await prisma.user.create({
    data: {
      email: body.data.email,
      name: body.data.name,
      role: body.data.role,
      emailVerified: false,
      ...(body.data.role === 'reader'
        ? {
            students: {
              create: {
                name: body.data.name,
                ...(defaultClass ? { Classes: { connect: { id: defaultClass.id } } } : {}),
              },
            },
          }
        : {}),
    },
  })

  return {
    success: true,
    user,
  }
})