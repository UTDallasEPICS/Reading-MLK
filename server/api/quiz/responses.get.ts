import { PrismaClient} from '@prisma/client';
import { defineEventHandler, getQuery, createError } from 'h3';

//call existing PrismaClient instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

//handles GET requests to fetch all responses for a given quiz and student
export default defineEventHandler(async (event) => {
    try {
        const { quiz_id, student_profile_id } = getQuery(event);
        //get the user (through auth middleware)
        const user = event.context.user;

        //check if they are valid ID's
        if (!quiz_id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing a question ID'
            });
        }
        //check what type of user is trying to access the responses
        // if it is a faculty member of admin, allow access to all responses
        if(!student_profile_id){
            /* Uncomment this when the auth middleware is fully active
            if (!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
                 throw createError({ statusCode: 403, statusMessage: 'Faculty or admin access only' });
            }
            */
            const allResponses = await prisma.quizResponse.findMany({
                where: {
                    quizId: Number(quiz_id)
                },
                include: {
                    StudentProfile: true, //allows faculty/admin to see which student submitted 
                    FRAnswer: true,
                    MCAnswer: true,
                }
            });
            return allResponses;
        }

        //find the quiz and the existing answers
        const responses = await prisma.quizResponse.findFirst({
            where: {
                quizId: Number(quiz_id),
                studentProfileId: Number(student_profile_id)
            },
            include: {
                FRAnswer: true,
                MCAnswer: true,
            }
        });
        return responses;
    }
    catch (error: any) {
        console.error('Error fetching responses:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to get responses',
        });
    }
});