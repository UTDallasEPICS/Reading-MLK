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
    //get the user
    const user = event.context.user;

    //Check if user exists and has the correct role (faculty  or admin)
    if (!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only faculty or administrators can delete responses.',
        });
    }
    //get the response ID
    const { id } = getRouterParams(event);
    const numId = Number(id);
    //check if it a valid response ID
    if (isNaN(numId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid response ID.',
        });
    }
    //delete the response
    try {
        await prisma.quizResponse.delete({
            where: {
                id: numId,
            }
        });
        return {
            success: true,
            message: 'Response deleted successfully.',
        }
    } 
    catch (error: any) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Response not found.',
        });
    }
});