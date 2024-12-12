import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const runtime = useRuntimeConfig()
    if(event.context.user?.cuid != undefined) {
        const {searchQuery, key} = getQuery(event);
        let searchTerm = searchQuery;
        let searchQueryObject = JSON.parse(searchQuery as string)
        let keyString = key as string;
        if(keyString == "first_name"){
            searchTerm={
                User:
                {
                [keyString]:
                    {
                    contains: searchQueryObject.first_name,
                    mode: "insensitive",
                    }
                }
             };
        }
        else if(keyString == "last_name"){
            searchTerm={
                User:
                {
                [keyString]:
                    {
                    contains: searchQueryObject.last_name,
                    mode: "insensitive",
                    }
                }
             };
        }
        else if (keyString == "district"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.district,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "faculty_email"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.faculty_email,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "school_name"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.school_name,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "phone_number"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.phone_number,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "departments"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.departments,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "grade"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.grade,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "district"){
            searchTerm={
                [keyString]:{
                    contains: searchQueryObject.district,
                    mode: "insensitive", 
                }
            }
        }
        else if (keyString == "dual_lang"){
            searchTerm={
                [keyString]:{
                    dual_lang: searchQueryObject.dual_lang === 'true',
                }
            }
        }
        else {
            searchTerm={
                [keyString]:{
                    contains: searchTerm as string,
                    mode: "insensitive",
                }
            }
        }
        const searchSpacesRemoved = (searchQuery as string).replaceAll(" ", "")

        if ((searchQuery as string) != "" && searchSpacesRemoved.length !=0){
        try{
            const pageResult =  await prisma.facultyProfile.findMany({
                where: searchTerm,
                include: {
                    Faculty: true,
                },
                });
                return {
                    data: pageResult,
                };
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
            }
            else if (error instanceof PrismaClientUnknownRequestError){
                console.log('Unknown request error: ' , error.message)
            }
            throw createError({ statusCode: 500, statusMessage: "Error fetching faculties" });
        }
        }
    }
    
});