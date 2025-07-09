//import {  } from '@auth0/auth0-spa-js';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

export default defineEventHandler(async event => {
  let parents = null;
  // const {id} = getQuery(event);
  const prisma = event.context.client;

  const id = getRouterParam(event, 'id');

  console.log(id as string)

  try {
    if (event.context.user?.role !== "admin") {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'You do not have permission to access this resource.'
      });
    }
    parents = await prisma.parentProfile.findFirst({
      where: {
        id: parseInt(id as string)
      },
      include: {
        ParentToChild: true,
        User: true,
      },
    });

    return parents;
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
