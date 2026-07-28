import { prisma } from './prisma'

// Hard-coded Friends of MLK class ID — every new student is enrolled here automatically.
export const MLK_CLASS_ID = 'c8f15743-c8e8-406a-9528-c9ae3b9afab7'
const MLK_CLASS_NAME = 'Friends of MLK'

/**
 * Returns the canonical "Friends of MLK" class, creating it with the hard-coded
 * ID if it doesn't yet exist in this environment (e.g. fresh local dev DB).
 */
export async function getMlkClass(): Promise<{ id: string; joinToken: string; name: string }> {
  const mlkClass = await prisma.class.upsert({
    where: { id: MLK_CLASS_ID },
    update: {},
    create: { id: MLK_CLASS_ID, name: MLK_CLASS_NAME },
    select: { id: true, joinToken: true, name: true },
  })
  return mlkClass
}

/**
 * Enroll a student in the Friends of MLK class if they are not already
 * a member. Safe to call multiple times.
 */
export async function enrollInMlkClass(studentId: number): Promise<void> {
  await prisma.class.update({
    where: { id: MLK_CLASS_ID },
    data: {
      Students: {
        connect: { id: studentId },
      },
    },
  })
}

