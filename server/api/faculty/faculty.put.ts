// Faculty PUT Endpoint
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {id, first_name, last_name, district, dual_lang, faculty_email, school_name,phone_number,department,grade,user_id} = body;

    // Check for missing data
    if (!(id && district && faculty_email && school_name && phone_number && department && grade && user_id)) {
        return {
            statusCode: 400,
            statusMessage: "Missing required fields",
        };
    }

    let updatedFaculty = null;

    try {
        if (event.context.user?.user_role !== "admin") { // If user role is not admin, throws an error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to update faculty profiles.'
            });
        }
        // Update existing faculty record
        updatedFaculty = await prisma.facultyProfile.update({
            where: {
                id
            },
            data: 
            {
                Faculty:
                {
                    update:
                    {
                        first_name,
                        last_name,
                    }
                },
                district,
                dual_lang,
                faculty_email,
                school_name,
                phone_number,
                department,
                grade,
                user_id,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            console.log('You experienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference');
        }
        else if (error instanceof PrismaClientUnknownRequestError){
            console.log('Unknown error: ' , error.message)
        }
        return {
            statusCode: 500,
            statusMessage: "Error updating faculty",
        };
    }

    return updatedFaculty;
});
