export default defineEventHandler( async event => {
    const body = await readBody(event)

    const parent = await event.context.client.parentProfile.create({
        data: body.parent,
      });

    const studentList = event.context.client.studentProfile.createMany({
        data: body.students
    })
    
    return {
        parent: parent,
        studentsList: studentList,
    }
})