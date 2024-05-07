export default defineEventHandler( async event => {
    const body = await readBody(event)
    const faculty = await event.context.client.FacultyProfile.create({
      data: body.faculty
});
    return {
      faculty: faculty,
    }
})