import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        Parent: true, 
      },
    });

    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error; // Rethrow the error so it can be handled elsewhere
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client when done
  }
});