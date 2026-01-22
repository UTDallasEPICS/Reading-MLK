import { PrismaClient } from '@prisma/client';

const prisma = (globalThis as any).prisma || new PrismaClient();
(globalThis as any).prisma = prisma;

export default defineEventHandler(async (event) => {
  try {
    if (!event.context.user?.id) {
      setResponseStatus(event, 401);
      return { success: false };
    }

    const body = await readBody(event);
    const quizResponseId = Number(body.quizResponseId);

    if (!quizResponseId) {
      setResponseStatus(event, 400);
      return { success: false, message: 'quizResponseId is required' };
    }

    // Delete associated MCAnswer and FRAnswer first to avoid FK constraint
    await prisma.mcAnswer.deleteMany({ where: { quizResponseId } });
    await prisma.frAnswer.deleteMany({ where: { quizResponseId } });

    // Delete the quiz response itself
    await prisma.quizResponse.delete({ where: { id: quizResponseId } });

    return { success: true };
  } catch (err) {
    console.error('Error deleting quiz response:', err);
    setResponseStatus(event, 500);
    return { success: false };
  }
});