import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';
const prisma = new PrismaClient();

//Changed async () to async (event)
export default defineEventHandler(async (event) => {
    let assignments = null;
    const body = await readBody(event);
    
    try {
        if (event.context.user?.role !== "admin") { //If role of user is not admin, should not be able to retrieve all assignments
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to access this resource.'
            });
        }

        // Retrieve all assignments
        assignments = await prisma.quiz.findMany({ 
            include: {
                //ClassToQuiz: true,
                //Quiz: true
            }
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
