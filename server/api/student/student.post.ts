import { PrismaClient } from '@prisma/client'
import { read } from 'fs'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Check if all required fields are present in the request body
    if (
        body.age &&
        body.grade &&
        body.reading_lvl &&
        body.birth_date &&
        body.gender &&
        body.school_name &&
        body.school_dist &&
        body.pref_lang &&
        body.first_name &&
        body.last_name &&
        body.pref_name
    ) {
        // Create a new student record
        try {
            const studentProfile = await prisma.studentProfile.create({
                data: {
                    age: parseInt(body.age),
                    grade: parseInt(body.grade),
                    reading_lvl: parseInt(body.reading_lvl),
                    birth_date: body.birth_date,
                    gender: body.gender,
                    school_name: body.school_name,
                    school_dist: body.school_dist,
                    pref_lang: body.pref_lang,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    pref_name: body.pref_name
                },
            });

            return {
                student: studentProfile
            }
        } catch (err) {
            console.log(err);
            return createError({ statusCode: 500, statusMessage: "Server Post Error" });
        }
    } else {
        return createError({ statusCode: 400, statusMessage: "Bad Request: Missing Required Fields" });
    }
});