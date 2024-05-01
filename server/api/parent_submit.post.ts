export default defineEventHandler( async event => {
    const body = await readBody(event)

        interface Student {
        first_name: string;
        last_name: string;
        pref_name: string;
        age: number;
        grade: string;
        reading_lvl: string;
        birth_date: string;
        gender: string;
        school_name: string;
        school_dist: string;
        pref_lang: string;
      }

    const parent = await event.context.client.ParentProfile.create({
        data: body.parent,
      });
    
    const studentList = await Promise.all(
        body.students.map(async (students: Student) => {
            const studentList = await event.context.client.StudentProfile.createMany({
                data: [{
                    first_name: body.students.first_name,
                    last_name: body.students.last_name,
                    pref_name: body.students.pref_name,
                    age: body.students.age,
                    grade: body.students.grade,
                    reading_lvl: body.students.reading_lvl,
                    birth_date: body.students.birth_date,
                    gender: body.students.gender,
                    school_name: body.students.school_name,
                    school_dist: body.students.school_dist,
                    pref_lang: body.students.pref_lang, // pass many to- prisma call 
                }],
            })
        })
    )

    return {
        parent: parent,
        studentsList: studentList,
    }
})