import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    try {
        // Check if all required fields are present in the request body
        if (body.age && body.grade && body.readingLevel && body.birthDate && body.gender && body.schoolName && body.schoolDistrict && body.prefLang) {
            // Create a new student record
            const student = await prisma.studentProfile.create({
                data: {
                    age: body.age,
                    grade: body.grade === 'preschool' ? 0 : body.grade,
                    reading_lvl: body.readingLevel,
                    birth_date: body.birthDate,
                    gender: body.gender,
                    school_name: body.schoolName,
                    school_dist: body.schoolDistrict,
                    pref_lang: body.prefLang,
                },
            });

            // Return the created student
            return {
                student: student,
            };
        } else {
            // Return an error if any required field is missing
            return createError({ statusCode: 400, statusMessage: "Missing Data" });
        }
    } catch (error) {
        console.error('Server Post Error:', error);
        return createError({ statusCode: 500, statusMessage: "Server Post Error" });
    }
});
