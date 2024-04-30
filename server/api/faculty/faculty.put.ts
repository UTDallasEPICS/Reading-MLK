import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const district = body.district;
    const dual_lang = body.dual_lang;
    const faculty_email = body.faculty_email;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const school_name = body.school_name;
    const phone_number = body.phone_number;
    const department = body.department;
    const grade = body.grade;

    // Check for missing data
    if (!(id && district && faculty_email && first_name && last_name && school_name && phone_number && department && grade)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let updatedFaculty = null;

    try {
        // Update existing faculty record
        updatedFaculty = await prisma.facultyProfile.update({
            where: {
                id: id
            },
            data: {
                district: district,
                dual_lang: dual_lang,
                faculty_email: faculty_email,
                first_name: first_name,
                last_name: last_name,
                school_name: school_name,
                phone_number: phone_number,
                department: department,
                grade: grade
            },
        });
    } catch (error) {
        console.error('Error updating faculty:', error);
        throw createError({ statusCode: 500, statusMessage: "Error updating faculty" });
    }

    return updatedFaculty;
});
