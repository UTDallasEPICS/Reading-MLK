import { PrismaClient } from '@prisma/client';
import { read } from 'fs'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    let parent = null;
    let error = null;

    const {id} = body

    if (id) {
        // Delete the parent record
        parent = await prisma.parentProfile.delete({
            where: {
                id,
            },
        }).catch(async (e) => {
            error = e;
        });
    }

    // Check if an error occurred during the deletion
    if (error) {
        return createError({ statusCode: 500, statusMessage: "Server Delete Error" });
    }

    return parent;
});
