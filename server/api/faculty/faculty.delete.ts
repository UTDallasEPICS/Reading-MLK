import { PrismaClient } from '@prisma/client';
import { canUpdateFaculty } from '~/server/utils/permissions'; // adjust the path if needed
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
  }

  // Get the current user (depends on your auth system — Nuxt typically uses event.context)
  const currentUser = event.context.user || null;

  // Permission check
  if (!canUpdateFaculty(currentUser, id)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to delete this faculty member.',
    });
  }

  try {
    const deletedFaculty = await prisma.facultyProfile.delete({
      where: { id },
    });
    return deletedFaculty;
  } catch (error) {
    console.error('Error deleting faculty:', error);
    throw createError({ statusCode: 500, statusMessage: 'Error deleting faculty' });
  }
});
