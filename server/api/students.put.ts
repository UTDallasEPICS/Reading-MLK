import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
    
    const body = await readBody(event)

    const id = body.id
    const firstName = body.firstName
    const lastName = body.lastName
    const streetNumber = body.streetNumber
    const streetAddress = body.streetAddress
    const city = body.city
    const zipCode = body.zipCode
    const county = body.county
    const authorId = body.authorId
    const phoneNumber = body.phoneNumber
    const studentEmail = body.studentEmail
    const schoolName = body.schoolName

    // Check for missing data
    if (!(id && firstName && lastName && streetAddress && city && zipCode && county && authorId && phoneNumber && studentEmail && schoolName)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" })
    }

    let student = null

    // Check if ID is provided
    if (id) {
        // Update existing student record
        student = await prisma.student.update({
            where: {
                id: id
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                streetNumber: streetNumber,
                streetAddress: streetAddress,
                city: city,
                zipCode: zipCode,
                county: county,
                author: {
                    connect: {
                        id: authorId
                    }
                },
                phoneNumber: phoneNumber,
                studentEmail: studentEmail,
                schoolName: schoolName,
            },
        })
    }
        
    return student
})
