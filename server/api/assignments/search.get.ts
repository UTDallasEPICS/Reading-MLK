import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    console.log("API /api/assignments/search called"); //Add this for debugging
    const runtime = useRuntimeConfig()
    
    //Checks for permission
    try {
        if (event.context.user?.role !== "admin") { //If user role is not admin, throws an error
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
    if (event.context.user.id) {
        const {searchQuery, key} = getQuery(event);
        //Console log statement for debugging, returns search query filters
        console.log("Search Query:", searchQuery);
        let searchTerm = {};
        let searchQueryObject: Record<string, any> = {};
        if (Object.keys(searchQueryObject).length === 0) {
            searchTerm = {}; //No filter, return all
        }

        //If the searchQuery object was properly initialized, parse it, otherwise throws an error.
        if (searchQuery) {
            try {
                searchQueryObject = JSON.parse(searchQuery as string);
            } catch (error) {
                //Console log returns error message if parsing fails
                console.error("Error parsing search query:", error);
                throw createError({ statusCode: 400, statusMessage: "Invalid search query format" });
            }
        }

        if (key && searchQueryObject[key]) {
            let keyString = key as string;
            //If the filter is searching for the first or last name.
            if (keyString == "first_name" || keyString == "last_name") { 
                searchTerm = {
                    AssignmentToStudent: {
                        some: {
                            Student: {
                                [keyString]: {
                                    contains: searchQueryObject[keyString],
                                    mode: "insensitive",
                                }
                            }
                        }
                    }
                };
            } else if (keyString == "class_name") { //If the filter is searching for the class name
                searchTerm = {
                    AssignmentToClass: {
                        some: {
                            Class: {
                                class_name: {
                                    equals: searchQueryObject[keyString],
                                }
                            }
                        }
                    }
                };
            } else if (keyString == "assignment_name") { //If the filter is searching for the assignment name
                searchTerm = {
                    name: {
                        contains: searchQueryObject[keyString],
                        mode: "insensitive",
                    }
                };
            } else {
                searchTerm = { //else, search by other fields
                    [keyString]: {
                        contains: searchQueryObject[keyString],
                        mode: "insensitive",
                    }
                };
            }
        } else {
            searchTerm = {}; //No filter, return all
        }

        
        const pageResult = await prisma.quiz.findMany({
            where: searchTerm,
            include: {
                AssignmentToStudent: { include: { Student: true } },
                AssignmentToClass: { include: { Class: true } }
            }
        });

        //Console log for debugging
        console.log("Assignments returned:", pageResult);

        return {
            data: pageResult,
        };
    }
    
});