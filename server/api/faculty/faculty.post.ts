// Faculty POST Endpoint
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {
        first_name,
        last_name,
        user_name,
        preferred_name,
        faculty_email,
        phone_number,
        school_name,
        district,
        department,
        grade,
        dual_lang
    
    } = body;

    // Check for missing data
    if (!first_name || !last_name || !preferred_name || 
        !district || !faculty_email || !school_name || 
        !phone_number || !department || !grade || !user_name || !dual_lang) {
        return {
            statusCode: 400,
            statusMessage: "Missing required fields",
        };
    }

    let newFaculty = null;
    let newUser = null;

    try {
        // First create the user record
        newUser = await prisma.user.create({
            data: {
                user_name,
                first_name,
                last_name,
                preferred_name,
                faculty_email,
                role: "faculty"  // default role to faculty if not provided
            },
        });

    try {
        // Create a new faculty record
        newFaculty = await prisma.facultyProfile.create({
            data: {
                //first_name,
                //last_name,
                //user_name,
                //preferred_name,
                faculty_email,
                phone_number,
                school_name,
                district,
                department,
                grade,
                //dual_lang,
                //role: "faculty"
            },
        });
        console.log('New faculty created successfully:', newFaculty);
    } catch (error) {
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
