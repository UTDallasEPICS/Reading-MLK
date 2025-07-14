// Faculty POST Endpoint
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log(body);
    const {
        faculty_email,
        phone_number,
        school_name,
        district,
        department,
        grade,
        dual_lang,
        first_name,
        last_name,
        user_name,
        id,
    } = body;

    //console.log("test");
    // Check for missing data
    /*
    if (!district || !faculty_email || !school_name || 
        !phone_number || !department || !grade || !dual_lang) {
        return {
            statusCode: 400,
            statusMessage: "Missing required fields",
        };
    }
    */

    let newFaculty = null;
    try {
        if (event.context.user?.role !== "admin") { // If user role is not admin, throws an error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to create a faculty profile.'
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            console.error('Error checking user role:', e.message);
        }
        return;
    }

    try {
        // Create a new faculty record
        newFaculty = await prisma.facultyProfile.create({
            data: {
                Faculty: {
                    connect: {
                        id: event.context.user.id,
                    },
                },
                district,
                dual_lang,
                faculty_email,
                school_name,
                phone_number,
                department,
                grade,
                //first_name,
                //last_name,
                //user_name,
                //preferred_name,
                id,
            },
        });
        //console.log('New faculty created successfully:', newFaculty);
    } catch (error) {
        console.error(error);
        console.error('Error creating faculty:', error);
        if (error instanceof PrismaClientKnownRequestError) {
            console.log('You experienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference');
        } else if (error instanceof PrismaClientUnknownRequestError) {
            console.log('Unknown error: ', error.message);
        }
        return {
            statusCode: 500,
            statusMessage: "Error creating faculty",
        };
    }

    return newFaculty;
});
