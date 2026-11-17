import type { PrismaClient } from '../../prisma/generated/client'

export const FORM_REWARD_XP = 1000

// The submission and reward either both commit or both roll back.
export async function completeForm(db: PrismaClient, studentId: number, formId: number) {
  return db.$transaction(async (tx) => {
    const existing = await tx.formSubmission.findUnique({
      where: { student_form: { student: studentId, form: formId } },
    })
    if (existing) {
      const student = await tx.student.findUniqueOrThrow({ where: { id: studentId } })
      return { ...existing, xpAwarded: 0, studentExp: student.exp }
    }
    const submission = await tx.formSubmission.create({
      data: { student: studentId, form: formId },
    })
    const student = await tx.student.update({
      where: { id: studentId },
      data: { exp: { increment: FORM_REWARD_XP } },
    })
    return { ...submission, xpAwarded: FORM_REWARD_XP, studentExp: student.exp }
  })
}
