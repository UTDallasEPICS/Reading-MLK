import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const runtime = useRuntimeConfig()
    if(event.context.user?.id != undefined) {
        const {searchQuery, key} = getQuery(event);
        console.log("Search Query:", searchQuery);
        let searchTerm = {};
        let searchQueryObject = {};

        try {
            searchQueryObject = JSON.parse(searchQuery as string);
        } catch (e) {
            console.error("Error parsing search query:", e);
            throw createError({ statusCode: 400, statusMessage: "Invalid search query format" });
        }

        let keyString = key as String;

        // Skip null or empty values
        if (searchQueryObject[keyString] === null || searchQueryObject[keyString] === undefined || searchQueryObject[keyString] === "") {
            return { data: [] };
        }

        if(keyString == "first_name" || keyString == "last_name" || keyString == "email"){
            searchTerm = {
                User: {
                    [keyString]: {
                        contains: searchQueryObject[keyString],
                        mode: "insensitive",
                    }
                }
            };
        }
        else {
            searchTerm = {
                [keyString]: {
                    contains: searchQueryObject[keyString],
                    mode: "insensitive",
                }
            };
        }

        const searchSpacesRemoved = (searchQuery as string).replaceAll(" ", "");
                
        if ((searchQuery as string) != "" && searchSpacesRemoved.length != 0){
            try {
                const pageResult = await prisma.studentProfile.findMany({
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
                throw createError({ statusCode: 500, statusMessage: "Error searching students" });
            }
        }
        return { data: [] };
    }
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
});