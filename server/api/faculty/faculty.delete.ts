import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const {id} = body

    // Check if ID is provided
    if (!id) {
        return createError({ statusCode: 400, statusMessage: "Missing ID" });
    }

    let deletedFaculty = null;

    try {
        if (event.context.user?.role !== "admin") { // If user role is not admin, throws an error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to delete this account.'
            });
        }
        // Delete faculty record
        deletedFaculty = await prisma.facultyProfile.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        throw createError({ statusCode: 500, statusMessage: "Error deleting faculty" });
    }

    return deletedFaculty;
});
