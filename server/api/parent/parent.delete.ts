import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    let parent = null;
    let error = null;

    const { id } = body;

    if (id) {
        // Attempt to delete the parent record
        try {
            parent = await prisma.parentProfile.delete({
                where: {
                    id,
                },
            });
        } catch (e) {
            error = e;
        }
    }

    // Check if an error occurred during deletion
    if (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Server Delete Error"
        });
    }

    return parent;
});
