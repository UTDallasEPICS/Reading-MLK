import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const parents = await prisma.parentProfile.findMany({
      include: {
        Student: true,
      },
    });

    return parents;
  } catch (error) {
    console.error('Error fetching parents:', error);
    throw error; // Rethrow the error so it can be handled elsewhere
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client when done
  }
});
