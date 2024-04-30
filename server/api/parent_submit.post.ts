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
        data: {
            firstName: body.parent.firstName,
            lastName: body.parent.lastName,
            birth_date: body.parent.birth_date,
            zipcode: body.parent.zipcode,
            phone_number: body.parent.phone_number,
            email: body.parent.email,
            social_media: body.parent.social_media,
            avg_num_book: body.parent.avg_num_book,
            yearly_income: body.parent.yearly_income,
            gender: body.parent.gender,
            martial_status: body.parent.martial_status,
        },
      });
    
    const studentList = await Promise.all(
        body.students.map(async (students: Student) => {
            const studentList = await event.context.client.StudentProfile.create({
                data: {
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
                    pref_lang: body.students.pref_lang,
                },
            })
        })
    )

    return {
        parent: parent,
        studentsList: studentList,
    }
})