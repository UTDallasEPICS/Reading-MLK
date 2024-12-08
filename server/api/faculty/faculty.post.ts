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
        dual_lang
    
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
    ///let newUser = null;
    /*
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
    */

    try {
        // Create a new faculty record
        newFaculty = await prisma.facultyProfile.create({
            data: {
                Faculty: {
                    connect: {
                        id: user_id
                    },
                },
                district: district,
                dual_lang: dual_lang,
                faculty_email: faculty_email,
                // first_name: first_name,
                // last_name: last_name,
                school_name: school_name,
                phone_number: phone_number,
                department: department,
                grade: grade,
                //first_name,
                //last_name,
                //user_name,
                //preferred_name,
                id: undefined,
                faculty_email: body.faculty.faculty_email,
                phone_number: body.faculty.phone_number,
                school_name: body.faculty.school_name,
                district: body.faculty.district,
                department: body.faculty.department,
                grade: body.faculty.grade,
                dual_lang: body.faculty.dual_lang,
                user_id: event.context.user.id
                //role: "faculty"
            },
        });
        console.log('New faculty created successfully:', newFaculty);
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
