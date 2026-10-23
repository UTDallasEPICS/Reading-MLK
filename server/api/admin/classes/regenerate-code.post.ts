import { prisma } from '../../../utils/prisma'
import { requireClassAccess } from '../../../utils/require-session'

const classCodeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const classToken = typeof body?.classToken === 'string' ? body.classToken.trim() : ''

  if (!classToken) {
    throw createError({ statusCode: 400, statusMessage: 'classToken is required' })
  }

  const { classId } = await requireClassAccess(event, classToken)
  let joinToken = ''

  do {
    joinToken = Array.from({ length: 5 }, () =>
      classCodeCharacters[Math.floor(Math.random() * classCodeCharacters.length)]
    ).join('')
  } while (await prisma.class.findUnique({ where: { joinToken } }))

  return await prisma.class.update({
    where: { id: classId },
    data: { joinToken },
    select: { joinToken: true, name: true },
  })
})