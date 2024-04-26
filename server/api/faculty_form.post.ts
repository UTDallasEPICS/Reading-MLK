export default defineEventHandler( async event => {
    const body = await readBody(event)
    const parentResult = await event.context.client.FacultyProfile.create({
        ...body
      });
})