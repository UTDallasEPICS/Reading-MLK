import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        ParentToChild: true,
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