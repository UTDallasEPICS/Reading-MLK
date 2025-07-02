import { PrismaClient } from '@prisma/client';
import { read } from 'fs'
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    let student = null;
    let error = null;

    const {id} = body
    try {
        // Check if the user has permission to delete a student profile
        if (event.context.user?.user_role !== "admin") {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to delete this account.'
            });
        }
    } catch (e) {
        console.error('Error checking user role:', e);
        throw createError({ statusCode: 500, statusMessage: "Error checking user role" });
    }
    
    if (id) {

            // Delete the student record
            student = await prisma.studentProfile.delete({
                where: {
                    id,
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