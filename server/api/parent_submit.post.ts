export default defineEventHandler( async event => {
    const body = await readBody(event)

    const parentResult = await event.context.client.ParentProfile.create({
        data: body.parent
      });

    const studentResults = await event.context.client.StudentProfile.create({
        data: body.students
    })
})