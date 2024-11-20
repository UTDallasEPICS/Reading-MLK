import type {ParentProfile} from '@prisma/client'
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

      let parent : ParentProfile= {
        id: 0,
        zipcode: '',
        yearly_income: '',
        birth_date: undefined,
        average_number_books: 0,
        phone_number: '',
        gender: '',
        marital_stat: '',
        social_media: '',
        user_id: 0
      };
      let studentlist = null;
    
      try {
       parent = await event.context.client.parentProfile.create({
        data: {
         
        
          zipcode: body.parent.zipcode,
          yearly_income: body.parent.yearly_income,
          birth_date: body.parent.birth_date,
          average_number_books: parseInt(body.parent.average_number_books),
          phone_number: body.parent.phone_number,
          gender: body.parent.gender,
          marital_stat: body.parent.marital_stat,
          social_media: body.parent.social_media,
          user_id : body.parent.user_id
      }
      });

      studentlist = await Promise.all(body.students.map((student:any) =>
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
      } catch(e)
        {console.error(e);
          return e;
        }   
    return {
        parent: parent,
        studentList: studentlist,
    }
})