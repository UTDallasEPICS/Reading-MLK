import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { canEditStudent } from '~/server/utils/permissions';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const currentUser = event.context.auth?.user;

    const {
        age, grade, reading_lvl, birth_date, gender,
        school_dist, school_name, pref_lang,
        first_name, last_name, pref_name
    } = body;

    if (
        !age || !grade || !reading_lvl || !birth_date || !gender ||
        !school_name || !school_dist || !pref_lang ||
        !first_name || !last_name || !pref_name
    ) {
        return createError({ statusCode: 400, statusMessage: "Bad Request: Missing Required Fields" });
    }

    // Only admin or parent can create a student
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "parent")) {
        return createError({ statusCode: 403, statusMessage: "Not authorized to create student" });
    }

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
                preferred_name: pref_name,
                parent_id: currentUser.role === "parent" ? currentUser.id : null
            },
        });

        return { student: studentProfile };

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.log(
                "Known error:",
                error.code,
                error.meta,
                error.message
            );
        } else if (error instanceof PrismaClientUnknownRequestError) {
            console.log("Unknown error:", error.message);
        }

        return createError({
            statusCode: 500,
            statusMessage: "Server Post Error",
        });
    }
});
