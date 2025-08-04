import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    console.log("API /api/assignments/search called"); // Add this for debugging
    const runtime = useRuntimeConfig()
    
    //Checks for permission
    try {
        if (event.context.user?.role !== "admin") { // If user role is not admin, throws an error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to search assignments.'
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            console.error('Error checking user role:', e.message);
        }
        return;
    }

    //Fetches all quizzes/assignments from database
    try {
        const pageResult = await prisma.quiz.findMany({
            include: {
                AssignmentToStudent: {
                    include: {
                        Student: true
                    }
                },
                AssignmentToClass: {
                    include: {
                        Class: true
                    }
                }
            }
        });
        //console.log("Fetched assignments:", pageResult[0]);
        return {
            data: pageResult,
        };
    } catch (error) { //Prints error message if there was an error
        console.error("Error fetching assignments:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "Failed to fetch assignments"
        });
    }
    
});