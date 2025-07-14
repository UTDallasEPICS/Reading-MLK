import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

export default defineEventHandler(async event => {
  let students = null;
  // const {id} = getQuery(event)
  const prisma = event.context.client;
  const id = getRouterParam(event, 'id');

  console.log(id as string)

  try {
      if (event.context.user?.role !== "admin") { //Checks role of user, and if role is not admin, throws an error
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'You do not have permission to access this resource.'
        });
      }
      students = await prisma.studentProfile.findFirst({
      where: {
        id: parseInt(id as string)
      },
      include: {
        ParentToChild: true,
        Student: true,
      },
    });

    return students;
  } catch (error) {
  if (error instanceof PrismaClientKnownRequestError){
    console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
  }
  else if (error instanceof PrismaClientUnknownRequestError){
    console.log('Unknown request error: ' , error.message)
  }
    throw error; // Rethrow the error so it can be handled elsewhere
  }
});