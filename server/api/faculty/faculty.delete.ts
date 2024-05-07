import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;

    // Check if ID is provided
    if (!id) {
        return createError({ statusCode: 400, statusMessage: "Missing ID" });
    }

    let deletedFaculty = null;

    try {
        // Delete faculty record
        deletedFaculty = await prisma.facultyProfile.delete({
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        throw createError({ statusCode: 500, statusMessage: "Error deleting faculty" });
    }

    return deletedFaculty;
});
