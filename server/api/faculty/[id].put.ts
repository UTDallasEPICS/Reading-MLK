import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid ID' })
  }

  const body = await readBody(event)

  const {
    first_name,
    last_name,
    district,
    dual_lang,
    faculty_email,
    school_name,
    phone_number,
    department,
    grade,
    TeacherToClass, // optional: [{ id: number }] or [{ class_id, teacher_id }]
    ...rest
  } = body || {}

  if (event.context.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const required = [first_name, last_name, district, faculty_email, school_name, phone_number, department, grade]
  if (required.some((x) => x === undefined || x === null)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const existing = await prisma.facultyProfile.findUnique({
    where: { id },
    select: { id: true, user_id: true }
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Faculty not found' })
  }

  // Build relation update for TeacherToClass if provided
  let teacherToClassUpdate: any | undefined
  if (Array.isArray(TeacherToClass)) {
    // Accept either [{id}] (class ids) or full join objects
    const connectIds = TeacherToClass
      .map((t: any) => (t?.id ?? t?.class_id))
      .filter((n: any) => Number.isFinite(Number(n)))
      .map((n: any) => ({ class_id_teacher_id: { class_id: Number(n), teacher_id: id } })) // only works if you use explicit compound unique; else use set/connect
    // Simplest safe reset: clear links, then recreate (requires compound id or manual upsert)
    teacherToClassUpdate = { deleteMany: { teacher_id: id } } // clear
    // If you actually store the join as separate records, you can recreate:
    // teacherToClassUpdate.createMany = { data: connectIds.map(c => ({ class_id: c.class_id_teacher_id.class_id, teacher_id: id })) }
  }

  const updatedFaculty = await prisma.facultyProfile.update({
    where: { id },
    data: {
      district,
      dual_lang,
      faculty_email,
      school_name,
      phone_number,
      department,
      grade,
      ...(teacherToClassUpdate ? { TeacherToClass: teacherToClassUpdate } : {}),
      ...rest
    }
  })

  await prisma.user.update({
    where: { id: existing.user_id },
    data: { first_name, last_name }
  })

  return { success: true, data: updatedFaculty }
})
