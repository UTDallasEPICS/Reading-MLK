import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {id, age, grade, reading_lvl, birth_date, gender, school_name, school_dist, pref_lang, first_name, last_name} = body

    const pref_name = body.preferred_name;

    // Check for missing data
    if (!(id && age && grade && reading_lvl && first_name && last_name && school_name && school_dist && pref_lang && first_name && last_name && pref_name)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let student = null;

    // Check if ID is provided
    if (id) {
        try {
            // Update existing student record
            student = await prisma.studentProfile.update({
                where: {
                    id
                },
                data: {
                    Student: {
                        update: {
                            first_name,
                            last_name,
                            preferred_name: pref_name
                        }
                    },
                    age,
                    grade,
                    reading_lvl,
                    birth_date,
                    gender,
                    school_name,
                    school_dist,
                    pref_lang,
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
            }
            else if (error instanceof PrismaClientUnknownRequestError){
                console.log('Unknown error: ' , error.message)
            }
            throw createError({ statusCode: 500, statusMessage: "Error updating student" });
        }
    }

    return student;
});