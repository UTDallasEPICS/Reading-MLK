import { PrismaClient} from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

//Avoid creating multiple instances of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
//check to instantiate prisma only if it is not in the "global" object
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

//handles POST requests to create of update free response answers
export default defineEventHandler(async (event) => {
    try{
        const body = await readBody(event);
        const { 
            student_profile_id,
            quiz_id,
            question_id,
            response_text
        } = body

        //validate required fields
        if(!student_profile_id) {
            throw createError({ statusCode: 400, statusMessage: 'student_profile_id required' });
        }
        if (!quiz_id) {
            throw createError({ statusCode: 400, statusMessage: 'quiz_id required' })
        }
        if (!question_id) {
            throw createError({ statusCode: 400, statusMessage: 'question_id required' })
        }
        //no text required
        //TODO: make error handling using try catch
        //Try to make it more efficient (make less server calls)
        //try to find existing quiz first
        let quiz_response = await prisma.quizResponse.findFirst({
            where: {
                quizId: quiz_id,
                studentProfileId: student_profile_id,
            }
        });
        //if there's no existing quiz response, create one
        if(!quiz_response){
            quiz_response = await prisma.quizResponse.create({
                data: {
                    quizId: quiz_id,
                    studentProfileId: student_profile_id,
                }
            });
        }

        //Find the FR question
        const existingQuestion = await prisma.fRAnswer.findFirst({
            where: {
                quizResponseId: quiz_response.id,
                questionId: question_id,
            }
        });
        
        //if it exists, update, or make a new one
        if(existingQuestion) {
            const update = await prisma.fRAnswer.update({
                where: { 
                    id: existingQuestion.id 
                },
                data: {
                    responseText: response_text
                }
            });
            return update;
        }
        else {
            const create = await prisma.fRAnswer.create({
                data: {
                    quizResponseId: quiz_response.id, //link to main response
                    questionId: question_id,
                    responseText: response_text
                }
            });
            return create;
        }
    }
    catch (error: any) {
        console.error('Error in processing answer submission: ', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to process answer submission',
        });
    }
});