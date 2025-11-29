import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id: quizId } = body;

    console.log("Delete request received for Quiz ID:", quizId);

    if (!quizId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing quiz ID"
        });
    }

    try {
        // Get all QuizResponses for this quiz
        const responses = await prisma.quizResponse.findMany({
            where: { quizId }
        });

        console.log("Found QuizResponses:", responses);

        // If nothing to delete, just return success
        if (responses.length === 0) {
            return { success: true, message: "No QuizResponses to delete." };
        }

        // Delete answers for each response
        for (const resp of responses) {
            await prisma.mCAnswer.deleteMany({
                where: { quizResponseId: resp.id }
            });

            await prisma.fRAnswer.deleteMany({
                where: { quizResponseId: resp.id }
            });
        }

        // Delete all QuizResponses
        await prisma.quizResponse.deleteMany({
            where: { quizId }
        });

        return { success: true };

    } catch (err) {
        console.error("Delete failed:", err);
        throw createError({
            statusCode: 500,
            statusMessage: "Server delete error"
        });
    }
});
