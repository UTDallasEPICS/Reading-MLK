import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
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

    if(event.context.user.id) {
        const {searchQuery, key} = getQuery(event);
        console.log("Search Query:", searchQuery);
        let searchQueryObject = {};
        try {
            searchQueryObject = JSON.parse(searchQuery as string);
        } catch (e) {
            console.error("Error parsing search query:", e);
            throw createError({ statusCode: 400, statusMessage: "Invalid search query format" });
        }
        
        /*let searchTerm: any = {};
        if ('id' in searchQueryObject) {
            searchTerm.id = Number(searchQueryObject.id);
        }
        
            try {
                const pageResult = await prisma.quiz.findMany({
                    where: searchTerm,
                });
                return {
                    data: pageResult,
                };
            } catch(error) {
                console.error("Search error:", error);
                if (error instanceof PrismaClientKnownRequestError){
                    console.log('Prisma error code:', error.code, error.meta, error.message);
                }
                else if (error instanceof PrismaClientUnknownRequestError){
                    console.log('Unknown request error:', error.message);
                }
                throw createError({ statusCode: 500, statusMessage: "Error searching assignments" });
            }   
    }
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });*/
    try {
        const pageResult = await prisma.Quiz.findMany({
            return {
                data: pageResult,
            };
        } catch (error) {
            console.error("Error fetching assignments:", error);
            throw createError({ statusCode: 500, statusMessage: "Error fetching assignments" });
        }
});