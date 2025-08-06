// THIS IS FOR REGISTER.VUE PAGE
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userData, profileData } = body

  try {
    const result = await prisma.$transaction(async (prismaTransaction) => {
      
      const user = await prismaTransaction.user.upsert({
        where: { email: userData.email },
        update: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          preferred_name: userData.preferred_name,
          gender: userData.gender,
          birth_date: new Date(userData.birth_date),
        },
        create: {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          preferred_name: userData.preferred_name,
          gender: userData.gender,
          birth_date: new Date(userData.birth_date),
        },
      })

      let profile
      if (profileData.role === 'student') {
        profile = await prismaTransaction.studentProfile.create({
          data: {
            username: profileData.username,
            zipcode: profileData.zipcode,
            school_dist: profileData.school_dist,
            school_name: profileData.school_name,
            starting_reading_level: profileData.starting_reading_level,
            preferred_language: profileData.preferred_language,
            user_email: user.email,
          },
        })
      } else if (profileData.role === 'parent') {
        profile = await prismaTransaction.parentProfile.create({
          data: {
            username: profileData.username,
            zipcode: profileData.zipcode,
            user_email: user.email,
          },
        })
      } else if (profileData.role === 'teacher') {
        profile = await prismaTransaction.teacherProfile.create({
          data: {
            username: profileData.username,
            zipcode: profileData.zipcode,
            school_dist: profileData.school_dist,
            school_name: profileData.school_name,
            user_email: user.email,
          },
        })
      }

      return { user, profile }
    })

    return {
      success: true,
      message: 'User and profile created successfully',
      data: {
        user: result.user,
        profile: result.profile,
      },
    }

  } catch (error) {
    console.error('Registration error:', error)
    

    if (error.code === 'P2002') {

      const target = error.meta?.target
      if (target?.includes('username')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Username already exists. Please choose a different username.',
        })
      } else if (target?.includes('email')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Email already exists with a profile of this type.',
        })
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user account. Please try again.',
    })
  }
})