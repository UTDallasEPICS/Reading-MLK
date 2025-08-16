import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const prisma = event.context.client
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (event.context.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid ID' })
  }

  const faculty = await prisma.facultyProfile.findFirst({
    where: { id },
    include: { TeacherToClass: true, Faculty: true }
  })

  if (!faculty) {
    throw createError({ statusCode: 404, statusMessage: 'Faculty not found' })
  }
  return faculty
})