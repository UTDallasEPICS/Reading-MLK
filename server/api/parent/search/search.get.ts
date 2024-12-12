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
        console.log(keyString)
        
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
        else if(keyString == "zipcode"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.zipcode,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "yearly_income"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.yearly_income,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "phone_number"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.phone_number,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "gender"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.gender,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "marital_stat"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.marital_stat,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "email"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.email,
                    mode: "insensitive",
                    }
             };
        }
        else if(keyString == "social_media"){
            searchTerm={
                [keyString]:
                    {
                    contains: searchQueryObject.social_media,
                    mode: "insensitive",
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
            console.log("Date: ", searchQueryObject.birth_date)
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
