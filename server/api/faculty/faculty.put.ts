// Faculty PUT Endpoint
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const district = body.district;
    const dual_lang = body.dual_lang;
    const faculty_email = body.faculty_email;
    const school_name = body.school_name;
    const phone_number = body.phone_number;
    const department = body.department;
    const grade = body.grade;
    const user_id = body.user_id;

    // Check for missing data
    if (!(id && district && faculty_email && school_name && phone_number && department && grade && user_id)) {
        return {
            statusCode: 400,
            statusMessage: "Missing required fields",
        };
    }

    let updatedFaculty = null;

    try {
        // Update existing faculty record
        updatedFaculty = await prisma.facultyProfile.update({
            where: {
                id: id
            },
            data: {
                district: district,
                dual_lang: dual_lang,
                faculty_email: faculty_email,
                school_name: school_name,
                phone_number: phone_number,
                department: department,
                grade: grade,
                user_id: user_id,
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
