import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const raw = await readBody(event);

  const {
    id: _id,
    user_id: _user_id,
    TeacherToClass,
    Faculty,
    first_name,
    last_name,
    ...cleanData
  } = raw;

  //Checks if user is an admin, throws error if not
  try {
    if (event.context.user?.role !== "admin") { // If user role is not admin, throws an error
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'You do not have permission to create a faculty profile.'
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error checking user role:', e.message);
    }
    return;
  }

  try {
    // 1. Update FacultyProfile
    const updatedFaculty = await prisma.facultyProfile.update({
      where: { id },
      data: cleanData
    });

    // 2. Update User (first_name, last_name)
    await prisma.user.update({
      where: { id: updatedFaculty.user_id },
      data: {
        first_name,
        last_name
      }
    });

    return {
      success: true,
      data: updatedFaculty
    };
  } catch (error) {
    console.error("Error updating faculty and user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Update failed"
    });
  }
});