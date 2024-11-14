import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const runtime = useRuntimeConfig()
    if(event.context.user?.cuid != undefined) {
        const { searchTerm, pageNumber, isPageList, order, sortedColumn } = getQuery(event);
        if((searchTerm as string) == "" && event.context.user?.role == "admin" && (isPageList == 1) as boolean){
            const [count, pageResult] = await prisma.$transaction([
                prisma.facultyProfile.count(),
                prisma.facultyProfile.findMany({
                    skip: pageNumber as number * 10,
                    take: 10,
                    orderBy: {
                        [sortedColumn as string || 'last_name']: (order as string) || 'asc'
                    }
                })

            ])
            return {
                Pagination: {total: count},
                data: pageResult
            }
        }
        const searchSpacesRemoved = (searchTerm as string).replaceAll(" ", "")
        let searchResult = null;
        if ((searchTerm as string) != "" && searchSpacesRemoved.length !=0){
            try{
            const [count, pageResult] = await prisma.$transaction([
                prisma.user.count({
                    where:{
                        role: 'faculty',
                        OR: [
                            {first_name: {
                                contains: searchTerm as string,
                            mode: 'insensitive'
                            }},
                            {last_name: {
                                contains: searchTerm as string,
                            mode: 'insensitive'
                            }},
                        ]
                    },
                }),
                prisma.user.findMany({
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
                    skip: pageNumber as number *10,
                    take: 10,
                    }),
            ])
            return {
                Pagination: {
                    total: count,
                },
                data: pageResult,
            };
        } catch(error){
            
        }
        return {
            Pagination: {
                total: 0,
            },
            data: [],
            unsorted_data: [],
        }
        }


       
    }
});