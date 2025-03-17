import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const runtime = useRuntimeConfig()
    if(event.context.user?.id != undefined) {
        const {searchQuery, key} = getQuery(event);
        console.log(searchQuery);
        let searchTerm = searchQuery;
        let searchQueryObject = JSON.parse(searchQuery as string)
        let keyString = key as string
        
        if(keyString == "first_name" || keyString == "last_name"){
            searchTerm={
                User:
                {
                [keyString]:
                    {
                    contains: searchQueryObject[keyString],
                    mode: "insensitive",
                    }
                }
             };
        }
        else if(keyString == "average_number_books"){
            console.log("Int: ", searchQueryObject.average_number_books)
            searchTerm={
                [keyString]:{
                    equals: parseInt(searchQueryObject.average_number_books),
                }
            }
        }
        else if(keyString == "birth_date"){
            searchTerm={
                [keyString]:{
                    equals: new Date(searchQueryObject.birth_date),
                }
            }

        }
        else {
            searchTerm={ 
                [keyString]: {
                    contains: searchQuery as string,
                    mode: "insensitive",
                }
            }
        }
        const searchSpacesRemoved = (searchQuery as string).replaceAll(" ", "")
        // let searchResult = null;
        if ((searchQuery as string) != "" && searchSpacesRemoved.length !=0){
            try{
            const pageResult = await prisma.parentProfile.findMany({
                 where: searchTerm,
                    include:{
                        User: true,
                    },
                    });
            return {
                data: pageResult,
            };
        } catch(error){
            console.error(error);
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

function parseISO(arg0: string) {
    throw new Error('Function not implemented.');
}
