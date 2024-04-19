import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  // get the cookie out of getCookie
  // user = JSON.parse() to turn cookie string into object
  // role is then available on user.role
  // if(user.role != 'admin') return
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        Parent: true, // Include parent information if needed
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
