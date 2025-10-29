// Faculty POST Endpoint
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { defineEventHandler, readBody } from 'h3';
import { canManageRelationships } from '~/server/utils/permissions'; // adjust the path if needed

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  const {
    faculty_email,
    phone_number,
    school_name,
    district,
    department,
    grade,
    dual_lang,
    first_name,
    last_name,
    user_name,
    id,
  } = body;

  const currentUser = event.context.user || null;

  // Permission check — only admins can create new faculty
  if (!canManageRelationships(currentUser)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to create a faculty profile.',
    });
  }

  let newFaculty = null;

  try {
    newFaculty = await prisma.facultyProfile.create({
      data: {
        Faculty: {
          connect: {
            id: event.context.user.id,
          },
        },
        district,
        dual_lang,
        faculty_email,
        school_name,
        phone_number,
        department,
        grade,
        id,
      },
    });
    console.log('New faculty created successfully:', newFaculty);
  } catch (error) {
    console.error('Error creating faculty:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      console.log(
        'You experienced this error code: ' + error.code,
        error.meta,
        error.message,
        'If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference'
      );
    } else if (error instanceof PrismaClientUnknownRequestError) {
      console.log('Unknown error: ', error.message);
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating faculty',
    });
  }

  return newFaculty;
});
