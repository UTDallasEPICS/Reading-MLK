export default defineEventHandler( async event => {
    const body = await readBody(event)

        interface Student {
        first_name: string;
        last_name: string;
        pref_name: string;
        age: number;
        grade: number;
        reading_lvl: number;
        birth_date: string;
        gender: string;
        school_name: string;
        school_dist: string;
        pref_lang: string;
      }

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