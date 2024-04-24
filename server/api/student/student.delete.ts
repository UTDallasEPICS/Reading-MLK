import { PrismaClient } from '@prisma/client';
import { read } from 'fs'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    let student = null;
    let error = null;

    if (body.id) {

            // Delete the student record
            student = await prisma.studentProfile.delete({
                where: {
                    id: body.id,
                },
            }).then((response) => {
                student = response
              }).catch(async (e) =>{
                error = e
              })
    }

    // Check if an error occurred during the deletion
    if (error) {
        return createError({ statusCode: 500, statusMessage: "Server Delete Error" });
    }

    return student;
});