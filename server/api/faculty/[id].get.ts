import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';

export default defineEventHandler(async event => {
    let faculties = null;
    const {id} = getQuery(event);
    const prisma = event.context.client;

    try {
        // Retrieve all faculty profiles
        faculties = await prisma.facultyProfile.findFirst({ 
            where: {
                id: parseInt(id as string)
            },
            include: {
                TeacherToClass: true,
                Faculty: true,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
        }
        else if (error instanceof PrismaClientUnknownRequestError){
            console.log('Unknown request error: ' , error.message)
        }
        throw createError({ statusCode: 500, statusMessage: "Error fetching faculties" });
    } 

    return faculties;
});
