import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { requireSession } from '../../../utils/require-session'
import {
  isPetType,
  nextPetStageAt,
  petCareCosts,
  petStageForForms,
  petStageNames,
  type PetAction,
} from '~~/shared/pet'
import type { Prisma } from '~~/prisma/generated/client'

const careSchema = z.object({ action: z.enum(['feed', 'water']) })

function careLevel(value: unknown) {
  const timestamp = typeof value === 'string' ? Date.parse(value) : NaN
  if (!Number.isFinite(timestamp)) return 100
  const elapsedFiveMinuteIntervals = Math.floor(Math.max(0, Date.now() - timestamp) / 300_000)
  return Math.max(15, 100 - elapsedFiveMinuteIntervals * 2.5)
}

function responseFor(student: { exp: number; settings: unknown; _count: { Submissions: number } }) {
  const settings = (
    student.settings && typeof student.settings === 'object' ? student.settings : {}
  ) as Record<string, unknown>
  const rawPet =
    settings.pet && typeof settings.pet === 'object'
      ? (settings.pet as Record<string, unknown>)
      : {}
  const type = isPetType(rawPet.type) ? rawPet.type : 'cat'
  const stage = petStageForForms(student._count.Submissions)
  return {
    type,
    completedForms: student._count.Submissions,
    stage,
    stageName: petStageNames[stage],
    nextStageAt: nextPetStageAt(stage),
    hunger: careLevel(rawPet.fedAt),
    thirst: careLevel(rawPet.wateredAt),
    xp: student.exp,
  }
}

export default defineEventHandler(async (event) => {
  const session = await requireSession(event)
  const id = Number(event.context.params?.id)
  if (!Number.isSafeInteger(id) || id <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Invalid student' })

  const student = await prisma.student.findFirst({
    where: { id, parentUserId: session.user.id },
    select: { exp: true, settings: true, _count: { select: { Submissions: true } } },
  })
  if (!student) throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  if (event.method === 'GET') return responseFor(student)
  if (event.method !== 'POST')
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })

  const body = careSchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid pet action' })
  const action = body.data.action as PetAction
  const cost = petCareCosts[action]
  if (student.exp < cost)
    throw createError({ statusCode: 400, statusMessage: `You need ${cost} XP` })

  const settings = (
    student.settings && typeof student.settings === 'object' ? student.settings : {}
  ) as Prisma.JsonObject
  const currentPet = (
    settings.pet && typeof settings.pet === 'object' ? settings.pet : {}
  ) as Prisma.JsonObject
  const pet = {
    ...currentPet,
    type: isPetType(currentPet.type) ? currentPet.type : 'cat',
    ...(action === 'feed'
      ? { fedAt: new Date().toISOString() }
      : { wateredAt: new Date().toISOString() }),
  }
  const updated = await prisma.student.update({
    where: { id },
    data: { exp: { decrement: cost }, settings: { ...settings, pet } },
    select: { exp: true, settings: true, _count: { select: { Submissions: true } } },
  })
  return responseFor(updated)
})
