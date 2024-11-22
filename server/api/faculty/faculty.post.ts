import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    console.log("me event",event);

    const district = body.faculty.district;
    const dual_lang = body.faculty.dual_lang;
    const faculty_email = body.faculty.faculty_email;
    const first_name = body.faculty.Faculty.first_name;
    const last_name = body.faculty.Faculty.last_name;
    const school_name = body.faculty.school_name;
    const phone_number = body.faculty.phone_number;
    const department = body.faculty.department;
    const grade = body.faculty.grade;
    const user_id = body.faculty.user_id;


    console.log("YO VAL:", [
        district, 
        dual_lang, 
        faculty_email, 
        first_name, 
        last_name, 
        school_name, 
        phone_number, 
        department, 
        grade, 
        user_id
    ].join('|'));
    

    // Check for missing data
    if (!(district && faculty_email && first_name && last_name && school_name && phone_number && department && grade && user_id)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let newFaculty = null;

    try {
        // Create a new faculty record
        newFaculty = await prisma.facultyProfile.create({
            data: {
                Faculty: {
                    connect: {
                        id: user_id
                    }
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
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
        }
        else if (error instanceof PrismaClientUnknownRequestError){
            console.log('Unknown error: ' , error.message)
        }
        throw createError({ statusCode: 500, statusMessage: "Error creating faculty", });
    }

    return newFaculty;
});
