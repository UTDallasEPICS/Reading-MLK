import { PrismaClient } from '@prisma/client'
import { read } from 'fs'

const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
    
    const body = await readBody(event)

    const {user_name, email, role, first_name, last_name} = body 

    let user = null
    let error = null

    // Check if all required fields are present in the request body
    if (body.user_name && body.email && body.client_cuid && body.role) {
        try {
            // Create the user using Prisma
            user = await prisma.user.create({
                data: {
                    user_name,
                    first_name,
                    last_name,
                    email,
                    role,
                },
            });
        } catch (error) {
            error = error;
        }
    } else {
        return createError({ statusCode: 400, statusMessage: "Missing required fields" });
    }

    if (error) {
        // Handle any errors during user creation
        return createError({ statusCode: 500, statusMessage: "Server Post Error" });
    }

    // Return the created user
    return {
        user: user
    };
});
