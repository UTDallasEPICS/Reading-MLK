import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        // Fetch all users from the database
        const users = await prisma.user.findMany();

        // Return the users
        return users;
    } catch (error) {
        // Handle any errors
        console.error('Error fetching users:', error);
        return createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
    }
});
