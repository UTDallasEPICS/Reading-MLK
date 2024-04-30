export default defineEventHandler( async event => {
    const body = await readBody(event)
    const faculty = await event.context.client.FacultyProfile.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        school_dist: body.school_dist,
        dual_lang: body.dual_lang,
        faculty_email: body.faculty_email,
        school_name: body.school_name,
        phone_number: body.phone_number,
        department: body.department,
        grade: body.grade,
    },
    });
    return {
      faculty: faculty
    }

})