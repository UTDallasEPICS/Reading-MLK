import { prisma } from './prisma'
import { MLK_CLASS_CODE } from './class-codes'

export async function ensureMlkClassExists() {
  return await prisma.class.upsert({
    where: { joinToken: MLK_CLASS_CODE },
    update: {},
    create: { name: 'MLK', joinToken: MLK_CLASS_CODE },
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
