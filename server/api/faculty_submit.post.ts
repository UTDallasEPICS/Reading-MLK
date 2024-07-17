export default defineEventHandler( async event => {
    const body = await readBody(event)
    /*const faculty = await event.context.client.FacultyProfile.create({
      data: body.faculty

      
});*/
const {user_id, ...d} = body.parent
event.context.client.FacultyProfile.create({
  ...d,
  User: {
    connect: { id: user_id },
  },
})
    /*return {
      faculty: faculty
    }*/

})