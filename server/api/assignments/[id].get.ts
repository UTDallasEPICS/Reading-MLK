import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';

export default defineEventHandler(async event => {
    let assignments = null;
    // const {id} = getQuery(event);
    const prisma = event.context.client;
    
    const id = getRouterParam(event, 'id');

    console.log(id as string)

    try {
        //If role of user is not admin, should not be able to retrieve all assignments
        if (event.context.user?.role !== "admin") { // Checks role of user, and if role is not admin, throws an error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to access this resource.'
            });
        }
        // Retrieve all assignments
        assignments = await prisma.Quiz.findFirst({ 
            where: {
                id: parseInt(id as string)
            },
            include: {
                //ClassToQuiz: true,
                Quiz: true,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
        }
        else if (error instanceof PrismaClientUnknownRequestError){
            console.log('Unknown request error: ' , error.message)
        }
        throw createError({ statusCode: 500, statusMessage: "Error fetching assignments" });
    } 

    return assignments;
});
