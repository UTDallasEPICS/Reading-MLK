import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    const body = await readBody(event);
    let user = null;
    let error = null;

    if (body.id) {
        try {
            user = await prisma.user.delete({
                where: {
                    id: parseInt(body.id) // Assuming 'id' is a string and needs to be parsed to an integer
                }
            });
        } catch (e) {
            error = e;
        }
    } else {
        error = new Error("Missing 'id' field in the request body");
    }

    if (error) {
        console.error(error);
        return createError({ statusCode: 500, statusMessage: "Server Delete Error" });
    }

    return user;
});
