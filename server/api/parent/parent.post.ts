import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {age, grade, birth_date, gender, school_dist, school_name, pref_lang, first_name, last_name, email, reading_lvl, preferred_name} = body

    try {
        if (event.context.user?.role !== "admin") {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to create a student profile.'
            });
        }
        // Check if all required fields are present in the request body
        if (
            age &&
            grade &&       
            reading_lvl &&
            birth_date &&
            gender &&
            school_name &&
            school_dist &&
            pref_lang &&
            first_name &&
            last_name &&
            preferred_name && 
            email
        ) {
            // Create a new student record
            try {
                const studentProfile = await prisma.studentProfile.create({
                    data: {
                        age: parseInt(age),
                        grade: parseInt(grade),
                        reading_lvl: parseInt(reading_lvl),
                        birth_date,
                        gender,
                        school_name,
                        school_dist,
                        pref_lang,
                        first_name,
                        last_name,
                        preferred_name,
                    },
                });

                return {
                    student: studentProfile
                }
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError){
                    console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
                }
                else if (error instanceof PrismaClientUnknownRequestError){
                    console.log('Unknown error: ' , error.message)
                }
                return createError({ statusCode: 500, statusMessage: "Server Post Error" });
            }
        } else {
            return createError({ statusCode: 400, statusMessage: "Bad Request: Missing Required Fields" });
        }
    } catch (e) {
        console.error('Error creating student profile:', e);
        return createError({ statusCode: 500, statusMessage: "Server Error" });
    }
    
});
