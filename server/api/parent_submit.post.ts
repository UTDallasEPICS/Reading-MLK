import { PrismaClient, Prisma, type ParentProfile, type StudentProfile } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

type ParentInput = {
  user_id: number
  zipcode: string
  yearly_income?: string | null
  birth_date?: string | Date | null
  average_number_books: number | string
  phone_number: string
  gender: string
  marital_stat?: string | null
  social_media?: string | null
}

type StudentInput = {
  first_name: string
  last_name: string
  age: number | string
  grade: number | string
  reading_lvl: number | string
  birth_date?: string | Date | null
  gender: string
  school_name: string
  school_dist: string
  pref_lang?: string | null
}

type BodyShape = {
  parent: ParentInput
  students: StudentInput[]
}

export default defineEventHandler(async (event) => {
  // If you want admin-only creation, keep this guard. Otherwise, remove it.
  if (event.context.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const prisma: PrismaClient =
    // prefer the client placed on event.context if your app does that
    (event as any).context?.client ?? new PrismaClient()

  const body = await readBody<BodyShape>(event)

  if (!body || !body.parent) {
    throw createError({ statusCode: 400, statusMessage: 'Missing request body' })
  }

  const p = body.parent
  const students = Array.isArray(body.students) ? body.students : []

  // Minimal validation to match your schema
  const missing: string[] = []
  if (p.user_id === undefined || p.user_id === null || Number.isNaN(Number(p.user_id))) missing.push('parent.user_id')
  if (!p.zipcode) missing.push('parent.zipcode')
  if (!p.phone_number) missing.push('parent.phone_number')
  if (!p.gender) missing.push('parent.gender')
  if (p.average_number_books === undefined || p.average_number_books === null) missing.push('parent.average_number_books')
  if (missing.length) {
    throw createError({ statusCode: 400, statusMessage: `Missing required fields: ${missing.join(', ')}` })
  }

  // Normalize/parse types
  const parentData: Omit<ParentProfile, 'id'> = {
    user_id: Number(p.user_id),
    zipcode: String(p.zipcode),
    yearly_income: p.yearly_income ?? null,
    birth_date: p.birth_date ? new Date(p.birth_date as any) : null,
    average_number_books: Number(p.average_number_books ?? 0),
    phone_number: String(p.phone_number),
    gender: String(p.gender),
    marital_stat: p.marital_stat ?? null,
    social_media: p.social_media ?? null
  }

  // Prepare students; validate essential fields for each
  const normalizedStudents: Omit<StudentProfile, 'id'>[] = students.map((s, idx) => {
    const errs: string[] = []
    if (!s.first_name) errs.push(`students[${idx}].first_name`)
    if (!s.last_name) errs.push(`students[${idx}].last_name`)
    if (s.age === undefined || s.age === null) errs.push(`students[${idx}].age`)
    if (s.grade === undefined || s.grade === null) errs.push(`students[${idx}].grade`)
    if (s.reading_lvl === undefined || s.reading_lvl === null) errs.push(`students[${idx}].reading_lvl`)
    if (!s.gender) errs.push(`students[${idx}].gender`)
    if (!s.school_name) errs.push(`students[${idx}].school_name`)
    if (!s.school_dist) errs.push(`students[${idx}].school_dist`)

    if (errs.length) {
      throw createError({ statusCode: 400, statusMessage: `Missing required student fields: ${errs.join(', ')}` })
    }

    return {
      first_name: String(s.first_name),
      last_name: String(s.last_name),
      age: Number(s.age ?? 0),
      grade: Number(s.grade ?? 1),
      reading_lvl: Number(s.reading_lvl ?? 0),
      birth_date: s.birth_date ? new Date(s.birth_date as any) : null,
      gender: String(s.gender),
      school_name: String(s.school_name),
      school_dist: String(s.school_dist),
      pref_lang: s.pref_lang ?? null
    }
  })

  try {
    let createdParent!: ParentProfile
    const createdStudents: StudentProfile[] = []

    await prisma.$transaction(async (tx) => {
      // 1) create parent profile
      createdParent = await tx.parentProfile.create({ data: parentData })

      // 2) create each student and link with ParentToChild
      for (const s of normalizedStudents) {
        const child = await tx.studentProfile.create({
          data: {
            ...s,
            ParentToChild: {
              create: {
                Parent: { connect: { id: createdParent.id } }
              }
            }
          }
        })
        createdStudents.push(child)
      }
    })

    return {
      success: true,
      parent: createdParent,
      studentList: createdStudents
    }
  } catch (e: any) {
    // Neat error messages for common cases
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // Unique constraint failed (phone_number, social_media, or user_id are @unique in your schema)
        const target = (e.meta as any)?.target ?? []
        throw createError({
          statusCode: 409,
          statusMessage: `Unique constraint failed on: ${Array.isArray(target) ? target.join(', ') : String(target)}`
        })
      }
      if (e.code === 'P2003') {
        // Foreign key failed (user_id might not exist)
        throw createError({
          statusCode: 409,
          statusMessage: 'Foreign key constraint failed (does the referenced user_id exist?)'
        })
      }
    }

    console.error('parent_submit error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to create parent and students' })
  }
})