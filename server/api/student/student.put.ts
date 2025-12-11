import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { canEditStudent } from '~/server/utils/permissions';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const currentUser = event.context.auth?.user;

    const {
        id, age, grade, reading_lvl, birth_date, gender,
        school_name, school_dist, pref_lang, first_name, last_name
    } = body;

    const pref_name = body.preferred_name;

    // Validate required fields
    if (!(id && age && grade && reading_lvl && first_name && last_name &&
        school_name && school_dist && pref_lang && pref_name)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    // Fetch student for permission check
    const studentRecord = await prisma.studentProfile.findUnique({
        where: { id }
    });

    if (!studentRecord) {
        return createError({ statusCode: 404, statusMessage: "Student not found" });
    }

    // Permission check
    if (!canEditStudent(currentUser, studentRecord)) {
        return createError({ statusCode: 403, statusMessage: "Not authorized to update student" });
    }

    try {
        const updated = await prisma.studentProfile.update({
            where: { id },
            data: {
                age,
                grade,
                reading_lvl,
                birth_date,
                gender,
                school_name,
                school_dist,
                pref_lang,
                first_name,
                last_name,
                preferred_name: pref_name,
            },
        });

        return updated;

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.log("Known error:", error.code, error.meta, error.message);
        } else if (error instanceof PrismaClientUnknownRequestError) {
            console.log("Unknown error:", error.message);
        }
        throw createError({ statusCode: 500, statusMessage: "Error updating student" });
    }
});
