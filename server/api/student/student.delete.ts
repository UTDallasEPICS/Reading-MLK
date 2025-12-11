import { PrismaClient } from '@prisma/client';
import { canEditStudent } from '~/server/utils/permissions';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;

    const currentUser = event.context.auth?.user;
    let error = null;

    if (!id) {
        return createError({ statusCode: 400, statusMessage: "Missing student ID" });
    }

    // Pull the student (to check permissions)
    const student = await prisma.studentProfile.findUnique({
        where: { id }
    });

    if (!student) {
        return createError({ statusCode: 404, statusMessage: "Student not found" });
    }

    // Permission check
    if (!canEditStudent(currentUser, student)) {
        return createError({ statusCode: 403, statusMessage: "Not authorized to delete student" });
    }

    // Delete student
    try {
        const deleted = await prisma.studentProfile.delete({
            where: { id },
        });
        return deleted;
    } catch (e) {
        error = e;
    }

    if (error) {
        return createError({ statusCode: 500, statusMessage: "Server Delete Error" });
    }
});
