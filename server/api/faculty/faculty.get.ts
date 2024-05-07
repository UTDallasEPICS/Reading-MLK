import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    let faculties = null;

    try {
        // Retrieve all faculty profiles
        faculties = await prisma.facultyProfile.findMany();
    } catch (error) {
        console.error('Error fetching faculties:', error);
        throw createError({ statusCode: 500, statusMessage: "Error fetching faculties" });
    }

    return faculties;
});
