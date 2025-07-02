import { PrismaClient } from '@prisma/client'
import { read } from 'fs'

const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
    
    const body = await readBody(event)
    let user = null
    let error = null

    const {id} = body
    
    try {
      if (event.context.user?.user_role !== "admin") { //If user role is not an admin, throws an error
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'You do not have permission to delete this account.'
        })
      }
    } catch (e) {
      console.error('Error checking user role:', e)
      throw createError({ statusCode: 500, statusMessage: "Error checking user role" })
    }

    if(id)
        await prisma.user.delete({
            where: {
            id,
            },
      }).then((response) => {
        user = response
      }).catch(async (e) =>{
        error = e
      })

      if(error)
        return createError({statusCode: 500, statusMessage: "Server Delete Error"})

    return user
  })