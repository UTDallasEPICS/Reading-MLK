import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Admin-only
  if (event.context.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readBody(event)
  const {
    // EITHER point to an existing user_id...
    user_id,
    // ...OR provide data to create a new user
    user_name,
    first_name,
    last_name,
    email, // login email for the user account (NOT faculty_email)

    // FacultyProfile fields
    district,
    dual_lang,
    faculty_email,    // contact email for faculty profile
    school_name,
    phone_number,
    department,
    grade,
  } = body || {}

  // Basic validation of profile fields
  const required = [district, faculty_email, school_name, phone_number, department, grade]
  if (required.some(v => v === undefined || v === null || v === '')) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required profile fields' })
  }

  // We’ll resolve the user within a transaction
  try {
    const created = await prisma.$transaction(async (tx) => {
      let connectUserId: number

      if (Number.isFinite(Number(user_id))) {
        // Connect to an existing user
        const existing = await tx.user.findUnique({
          where: { id: Number(user_id) },
          select: { id: true, role: true },
        })
        if (!existing) {
          throw createError({ statusCode: 404, statusMessage: 'User not found' })
        }

        // Ensure the role matches reality
        if (existing.role !== 'faculty') {
          await tx.user.update({
            where: { id: existing.id },
            data: { role: 'faculty' },
          })
        }

        connectUserId = existing.id
      } else if (user_name && first_name && last_name && email) {
        // Create a new user and connect
        const newUser = await tx.user.create({
          data: {
            user_name,
            first_name,
            last_name,
            email,
            role: 'faculty',
          },
        })
        connectUserId = newUser.id
      } else {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Provide either a valid user_id OR user_name + first_name + last_name + email to create a user.',
        })
      }

      // Create the faculty profile linked to that user
      const profile = await tx.facultyProfile.create({
        data: {
          Faculty: { connect: { id: connectUserId } },
          district,
          dual_lang,
          faculty_email,
          school_name,
          phone_number,
          department,
          grade,
        },
        include: { Faculty: true }, // return the linked User for UI convenience
      })

      return profile
    })

    return { success: true, data: created }
  } catch (err: any) {
    // Unique constraint niceties
    if (err?.code === 'P2002') {
      // err.meta?.target usually contains ["faculty_email"] or ["user_id"]
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(',') : 'unique field'
      throw createError({
        statusCode: 409,
        statusMessage: `Faculty already exists (conflict on ${target}).`,
      })
    }
    // Re-throw h3 createError from inside the tx as-is
    if (err?.statusCode) throw err

    console.error('Error creating faculty:', err)
    throw createError({ statusCode: 500, statusMessage: 'Error creating faculty' })
  }
})
