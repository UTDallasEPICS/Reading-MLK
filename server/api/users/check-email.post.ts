import { prisma } from '../../utils/prisma'
import { emailSchema } from '~~/server/utils/schemas'

export default defineEventHandler(async (event) => {
  const email = emailSchema.safeParse(await readBody(event))

  if (!email.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.data,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  return {
    exists: !!user,
    user,
  }
})