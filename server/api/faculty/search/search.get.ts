import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const runtime = useRuntimeConfig()
    if(event.context.user?.cuid != undefined) {
        const {searchTerm} = getQuery(event);
        const searchSpacesRemoved = (searchTerm as string).replaceAll(" ", "")
        let searchResult = null;
        if ((searchTerm as string) != "" && searchSpacesRemoved.length !=0){
            try{
               const pageResult =  await prisma.user.findMany({
                    where: {
                        role: 'faculty',
                        OR: [
                            {first_name: {
                                contains: searchTerm as string,
                            mode: 'insensitive',
                            }},
                            {last_name: {
                                contains: searchTerm as string,
                            mode: 'insensitive'
                            }},
                        ]
                    },
                    });
                    return {
                        data: pageResult,
                    }
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