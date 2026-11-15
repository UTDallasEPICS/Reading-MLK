import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/require-session'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const [coaches, classes, students] = await Promise.all([
    prisma.coach.findMany({
      orderBy: { User: { name: 'asc' } },
      select: {
        id: true,
        tag: true,
        verified: true,
        school: true,
        district: true,
        zipcode: true,
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Classes: {
          select: {
            id: true,
            name: true,
            Students: {
              select: {
                id: true,
                name: true,
              },
            },
            FormGroups: {
              select: {
                Forms: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        Coach: {
          select: {
            id: true,
            tag: true,
            school: true,
            User: { select: { name: true } },
          },
        },
        Students: {
          select: {
            id: true,
            name: true,
            exp: true,
          },
        },
        FormGroups: {
          orderBy: { startDate: 'asc' },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            Forms: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                published: true,
                startDate: true,
                endDate: true,
                Submissions: { select: { id: true } },
              },
            },
          },
        },
      },
    }),
    prisma.student.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        exp: true,
        Classes: {
          select: {
            id: true,
            name: true,
            Coach: {
              select: {
                id: true,
                tag: true,
                school: true,
                User: { select: { name: true } },
              },
            },
          },
        },
        Submissions: {
          select: {
            id: true,
            submissionDate: true,
            Form: { select: { title: true } },
          },
          orderBy: { submissionDate: 'desc' },
        },
      },
    }),
  ])

  const coachRecords = coaches.map((coach) => ({
    id: coach.id,
    name: coach.User.name,
    email: coach.User.email,
    tag: coach.tag,
    verified: coach.verified,
    school: coach.school ?? '',
    district: coach.district ?? '',
    zipcode: coach.zipcode ?? '',
    classes: coach.Classes.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
    })),
    classCount: coach.Classes.length,
    studentCount: new Set(
      coach.Classes.flatMap((classroom) => classroom.Students.map((student) => student.id))
    ).size,
    formCount: coach.Classes.reduce(
      (total, classroom) =>
        total +
        classroom.FormGroups.reduce((groupTotal, group) => groupTotal + group.Forms.length, 0),
      0
    ),
  }))

  const classRecords = classes.map((classroom) => ({
    id: classroom.id,
    name: classroom.name,
    teachers: classroom.Coach.map((coach) => ({
      id: coach.id,
      name: coach.User.name,
      tag: coach.tag,
      school: coach.school ?? '',
    })),
    schools: [
      ...new Set(
        classroom.Coach.map((coach) => coach.school).filter((school): school is string =>
          Boolean(school)
        )
      ),
    ],
    students: classroom.Students,
    forms: classroom.FormGroups.flatMap((group) =>
      group.Forms.map((form) => ({
        id: form.id,
        title: form.title,
        published: form.published,
        startDate: form.startDate,
        endDate: form.endDate,
        submissionCount: form.Submissions.length,
      }))
    ),
  }))

  const studentRecords = students.map((student) => ({
    id: student.id,
    name: student.name,
    exp: student.exp,
    classes: student.Classes.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
    })),
    teachers: [
      ...new Map(
        student.Classes.flatMap((classroom) =>
          classroom.Coach.map(
            (coach) =>
              [
                coach.id,
                {
                  id: coach.id,
                  name: coach.User.name,
                  tag: coach.tag,
                  school: coach.school ?? '',
                },
              ] as const
          )
        )
      ).values(),
    ],
    schools: [
      ...new Set(
        student.Classes.flatMap((classroom) =>
          classroom.Coach.map((coach) => coach.school).filter((school): school is string =>
            Boolean(school)
          )
        )
      ),
    ],
    submissions: student.Submissions.map((submission) => ({
      id: submission.id,
      date: submission.submissionDate,
      form: submission.Form.title,
    })),
  }))

  return {
    schools: [...new Set(coachRecords.map((coach) => coach.school).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    ),
    coaches: coachRecords,
    teachers: coachRecords.filter((coach) => coach.tag === 'teacher'),
    classes: classRecords,
    students: studentRecords,
    totalStudents: studentRecords.length,
  }
})
