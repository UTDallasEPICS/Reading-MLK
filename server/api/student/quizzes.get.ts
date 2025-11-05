import { PrismaClient } from '@prisma/client';

const prisma = (globalThis as any).prisma || new PrismaClient();
(globalThis as any).prisma = prisma;

export default defineEventHandler(async (event) => {
  try {
    // Check if user is logged in
    if (!event.context.user?.id) {
      setResponseStatus(event, 401);
      return { data: [] };
    }

    const query = getQuery(event);
    const studentId = Number(query.studentId);
    const dateStr = query.date as string; // format: "YYYY-MM-DD"

    if (!studentId || !dateStr) {
      setResponseStatus(event, 400);
      return { data: [] };
    }

    // Start and end of the day
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const quizzes = await prisma.quizResponse.findMany({
      where: {
        studentProfileId: studentId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        MCAnswer: true,
        FRAnswer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: quizzes };
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    setResponseStatus(event, 500);
    return { data: [] };
  }
});