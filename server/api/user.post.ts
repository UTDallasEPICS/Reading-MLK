import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    let user = null;
    let error = null;

    // Check if all required fields are present in the request body
    if (
        body.user_name &&
        body.email &&
        body.client_cuid &&
        body.role
    ) {
        try {
            user = await prisma.user.create({
                data: {
                    user_name: body.user_name,
                    email: body.email,
                    client_cuid: body.client_cuid,
                    role: body.role
                },
            });
        } catch (err) {
            console.error(err);
            return createError({ statusCode: 500, statusMessage: "Server Post Error" });
        }
    } else {
        return createError({ statusCode: 400, statusMessage: "Bad Request: Missing Required Fields" });
    }

    return {
        user: user
    };
});
