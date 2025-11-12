import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    let quizResponse = null;
    let error = null;

    const {id} = body

    if (id) {
        try {
            // first delete related MC and FR answers
            await prisma.mCAnswer.deleteMany({
                where: { quizResponseId: id},
            });
            await prisma.fRAnswer.deleteMany({
                where: { quizResponseId: id},
            });
            // now delete QuizResponse
            quizResponse = await prisma.quizResponse.delete({
                where: {
                    id,
                },
            });
        } catch(e) {
            error = e;
        };
    }

    // Check if an error occurred during the deletion
    if (error) {
        return createError({ statusCode: 500, statusMessage: "Server Delete Error" });
    }

    return quizResponse;
});