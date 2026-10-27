import { prisma } from './prisma'

export async function ensureMlkClassExists() {
  const classes = await prisma.class.findMany({
    where: { name: 'MLK Class' },
    select: { id: true },
    take: 2,
  })

  if (classes.length > 1) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Multiple classes named MLK Class are configured',
    })
  }

  if (classes.length === 1) {
    return classes[0]
  }

  return await prisma.class.create({
    data: { name: 'MLK Class' },
    select: { id: true },
  })
}

export async function findMlkClassForCoach(userId: string) {
  return await prisma.class.findFirst({
    where: {
      name: 'MLK Class',
      Coach: { some: { userId } },
    },
    select: { id: true },
  })
}

export async function ensureMlkClassMembership(userId: string) {
  const classroom = await ensureMlkClassExists()
  const students = await prisma.student.findMany({
    where: { parentUserId: userId },
    select: {
      id: true,
      Classes: { where: { id: classroom.id }, select: { id: true } },
    },
  })

  const studentsToEnroll = students.filter((student) => student.Classes.length === 0)

  if (studentsToEnroll.length > 0) {
    await prisma.$transaction(
      studentsToEnroll.map((student) =>
        prisma.student.update({
          where: { id: student.id },
          data: { Classes: { connect: { id: classroom.id } } },
        })
      )
    )
  }

  return classroom
}
