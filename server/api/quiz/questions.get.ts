import { PrismaClient} from '@prisma/client';
import { defineEventHandler, getQuery, createError } from 'h3';

//Avoid creating multiple instances of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
//check to instantiate prisma only if it is not in the "global" object
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

//using Question.quiz_id, handling all GET requests
export default defineEventHandler(async (event) => {
    try {
        const { quizId } = getQuery(event);

        //check if it is a non empty quiz
        if (!quizId) {
            throw createError({ statusCode: 400, statusMessage: 'missing quiz ID' });
        }

        //get questions
        const questions = await prisma.question.findMany({
            where: {quiz_id: Number(quizId)},
            orderBy: {id: 'asc'},
        })
        return questions;
    } catch (error: any) {
        console.error('Error fetching questions:', error);
        throw createError({ 
            statusCode: 500,
            statusMessage: 'Failed to get quiz questions',
        });
    }
});