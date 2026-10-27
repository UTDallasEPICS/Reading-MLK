import { prisma } from './prisma'

export async function findMlkClass() {
  const classes = await prisma.class.findMany({
    where: {
      name: 'MLK Class',
      Coach: {
        some: {
          User: { name: 'Rae' },
        },
      },
    },
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
  const defaultClass = await findMlkClass()
  const students = await prisma.student.findMany({
    where: { parentUserId: userId },
    select: { id: true, Classes: { where: { id: defaultClass.id }, select: { id: true } } },
  })

  if (students.length === 0) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, role: true },
    })

    if (user.role === 'reader') {
      await prisma.student.create({
        data: {
          name: user.name,
          parentUserId: userId,
          settings: { dyslexiaFont: false, language: 'en', fontSize: 1 },
          Classes: { connect: { id: defaultClass.id } },
        },
      })
    }
  } else {
    const studentsToEnroll = students.filter((student) => student.Classes.length === 0)
    await prisma.$transaction(
      studentsToEnroll.map((student) =>
        prisma.student.update({
          where: { id: student.id },
          data: { Classes: { connect: { id: defaultClass.id } } },
        })
      )
    )
  }

  return defaultClass
}
