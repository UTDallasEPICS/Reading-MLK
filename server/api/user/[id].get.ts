import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs'

export default defineEventHandler(async event => {
    try{
        let users = null;
        // const {id} = getQuery(event)
        const prisma = event.context.client;
        const id = getRouterParam(event, 'id');

        console.log(id as string)
        
        users = await prisma.user.findFirst({
            where: {
                id: parseInt(id as string)
            },
            include:{
                Parents: true,
                Admin: true,
                Faculty: true,
                Children:true,
            },
        });
        return users;
    } catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
          }
          else if (error instanceof PrismaClientUnknownRequestError){
            console.log('Unknown request error: ' , error.message)
          }
            throw error; // Rethrow the error so it can be handled elsewhere
    }
});