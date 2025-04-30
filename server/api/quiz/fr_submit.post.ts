import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { quizId, studentProfileId, answers } = body;

  try {
    const quizResponse = await prisma.quizResponse.create({
      data: {
        quizId: Number(quizId),
        studentProfileId: Number(studentProfileId),
      }
    });

    const frAnswers = await Promise.all(
        answers.map((answer: { questionId: number; responseText: string }) =>
            prisma.fRAnswer.create({
                data: {
                quizResponseId: quizResponse.id,
                questionId: Number(answer.questionId),
                responseText: answer.responseText,
                }
            })
        )     
    );

    return {
      success: true,
      quizResponse,
      frAnswers,
    };
  } catch (e) {
    console.error('Submission error:', e);
    return {
      success: false,
      error: 'Submission failed',
      details: e,
    };
  }
});
