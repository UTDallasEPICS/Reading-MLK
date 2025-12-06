import { PrismaClient} from '@prisma/client';
import { defineEventHandler, getQuery, createError } from 'h3';

//call existing PrismaClient instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

//submit quiz
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { quiz_id, student_id } = body;

        //check if valid quiz
        if(!quiz_id || !student_id){
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing quiz ID or student ID',
            });
        }

        //find the quiz
        const currentResponse = await prisma.quizResponse.findFirst({
            where: {
                quizId: Number(quiz_id),
                studentProfileId: Number(student_id),
            }
        });

        //check if it is a valid active quiz
        if(!currentResponse){
            throw createError({
                statusCode: 404,
                statusMessage: 'No active quiz to submit',
            });
        }

        //update status to submitted
        const updateResponse = await prisma.quizResponse.update({
            where: {
                id: currentResponse.id,
            },
            data: {
                status: 'SUBMITTED',
                submittedAt: new Date(),
            },
        });

        return updateResponse;
    }
    catch (error: any) {
        console.error('Error submitting quiz:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Quiz failed to submit!',
        });
    }
});