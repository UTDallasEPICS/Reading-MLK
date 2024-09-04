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
        data: {
          User: {
            connect: {
              id: body.parent.user_id
            }
          },
          zipcode: body.parent.zipcode,
          yearly_income: body.parent.yearly_income,
          birth_date: body.parent.birth_date,
          avg_num_book: parseInt(body.parent.avg_num_book),
          password: body.parent.password,
          phone_number: body.parent.phone_number,
          gender: body.parent.gender,
          marital_stat: body.parent.marital_stat,
          first_name: body.parent.first_name,
          last_name: body.parent.last_name,
          email: body.parent.email,
          social_media: body.parent.social_media,
      }
      });

      const studentList = await Promise.all(body.students.map((student:any) =>
            event.context.client.studentProfile.create({
              data: {
                ParentToChild: {
                  create: {
                    Parent: {
                      connect: {
                        id: parent.id
                      }
                    }
                  }
                },
                age: parseInt(student.age),
                grade: parseInt(student.grade),
                reading_lvl: parseInt(student.reading_lvl),
                birth_date: student.birth_date,
                gender: student.gender,
                school_name: student.school_name,
                school_dist: student.school_dist,
                pref_lang: student.pref_lang,
                first_name: student.first_name,
                last_name: student.last_name,
                pref_name: student.pref_name,
                user_id: student.user_id,
              }
            })
          ));
        /*
    const studentList = await tx.studentProfile.createMany({
        data: {
          ParentToChild: {
            create: {
              id: parent.id
            }
          },
          age: parseInt(body.students[0].age),
          grade: parseInt(body.students[0].grade),
          reading_lvl: parseInt(body.students[0].reading_lvl),
          birth_date: body.students[0].birth_date,
          gender: body.students[0].gender,
          school_name: body.students[0].school_name,
          school_dist: body.students[0].school_dist,
          pref_lang: body.students[0].pref_lang,
          first_name: body.students[0].first_name,
          last_name: body.students[0].last_name,
          pref_name: body.students[0].pref_name,
          user_id: body.students[0].user_id,
        }        
    })})*/
    /*
    try {
      // Create a new faculty record
      newParent = await prisma.facultyProfile.create({
          data: {
              Faculty: {
                  connect: {
                      id: user_id
                  }
              },
              district: district,
              dual_lang: dual_lang,
              faculty_email: faculty_email,
              first_name: first_name,
              last_name: last_name,
              school_name: school_name,
              phone_number: phone_number,
              department: department,
              grade: grade,
          },
      });
  } catch (error) {
      console.error('Error creating faculty:', error);
      throw createError({ statusCode: 500, statusMessage: "Error creating faculty" });
  }*/
  /*
    console.log("Testing too")
    const {user_id, ...d} = body.parent
      event.context.client.parentProfile.create({
        ...d,
        User: {
          connect: { id: user_id },
        },
        ParentToChild: {
          createMany: {
            data: [
              ...body.students.map((s:any) => ({
                ...s,
                User: {
                  data: {
                    email: s.email,
                  },
                },
              })),
            ],
          },
        },
      })
    */
    return {
        parent: parent,
        studentList: studentList,
    }
})