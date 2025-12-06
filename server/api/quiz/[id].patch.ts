import { PrismaClient} from '@prisma/client';
import { getRouterParams, defineEventHandler, createError } from 'h3';

//Avoid creating multiple instances of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
//check to instantiate prisma only if it is not in the "global" object
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default defineEventHandler(async (event) => {
    try {
        //quiz ID
        const { id } = getRouterParams(event);
        //score 
        const body = await readBody(event);
        const { score } = body;
        //get user
        const user = event.context.user;

        //check
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing ID',
            });
        }
        if(score === undefined || score === null){
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing score',
            });
        }
        //user check with MagicLinks
        if(!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Permission denied',
            });
        }

        const gradedResponse = await prisma.quizResponse.update({
            where: {
                id: Number(id),
            },
            data: {
                score: Number(score),
            }
        });

        return gradedResponse;
    }
    catch (error: any) {
        console.error('Error viewing responses:', error);
        //case where response ID not found
        if(error.code === 'P2025'){
            throw createError({
                statusCode: 404,
                statusMessage: 'Response not found',
            });
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to grade response',
        });
    }
});