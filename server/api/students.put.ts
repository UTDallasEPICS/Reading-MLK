import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const age = body.age;
    const grade = body.grade;
    const reading_lvl = body.reading_lvl;
    const birth_date = body.birth_date;
    const gender = body.gender;
    const school_name = body.school_name;
    const school_dist = body.school_dist;
    const pref_lang = body.pref_lang;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const pref_name = body.pref_name;

    // Check for missing data
    if (!(id && age && grade && reading_lvl && first_name && last_name && school_name && school_dist)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let student = null;

    // Check if ID is provided
    if (id) {
        try {
            // Update existing student record
            student = await prisma.studentProfile.update({
                where: {
                    id: id
                },
                data: {
                    age: age,
                    grade: grade,
                    reading_lvl: reading_lvl,
                    birth_date: birth_date,
                    gender: gender,
                    school_name: school_name,
                    school_dist: school_dist,
                    pref_lang: pref_lang,
                    first_name: first_name,
                    last_name: last_name,
                    pref_name: pref_name
                },
            });
        } catch (error) {
            console.error('Error updating student:', error);
            throw createError({ statusCode: 500, statusMessage: "Error updating student" });
        }
    }

    return student;
});
