import { PrismaClient } from '@prisma/client'
import { read } from 'fs'

const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
    
    const body = await readBody(event)
    if (body.age && body.grade && body.readingLevel && body.birthDate && body.gender && body.schoolName && body.schoolDistrict && body.prefLang) {
        try{
            const student = await prisma.student.create({
                data: {
                    age: body.age,
                    grade: body.grade === 'preschool' ? 0 : body.grade,
                    reading_lvl: body.readingLevel,
                    birth_date: body.birthDate,
                    gender: body.gender,
                    school_name: body.schoolName,
                    school_dist: body.schoolDistrict,
                    pref_lang: body.prefLang,
                },
            })
            
            return {
                student: student
            }
        } catch(err){
            console.log(err)
            return createError({statusCode: 500, statusMessage: "Server Post Error"})
        }
    }
})
