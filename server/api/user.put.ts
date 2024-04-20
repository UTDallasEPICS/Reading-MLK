import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const user_name = body.user_name;
    const email = body.email;
    const client_cuid = body.client_cuid;
    const role = body.role;

    // Check for missing data
    if (!(id && user_name && email && client_cuid && role)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let user = null;

    // Check if ID is provided
    if (id) {
        try {
            // Update existing user record
            user = await prisma.user.update({
                where: {
                    id: parseInt(id) // Assuming 'id' is a string and needs to be parsed to an integer
                },
                data: {
                    user_name: user_name,
                    email: email,
                    client_cuid: client_cuid,
                    role: role
                },
            });
        } catch (error) {
            console.error('Error updating user:', error);
            throw createError({ statusCode: 500, statusMessage: "Error updating user" });
        }
    }

    return user;
});
