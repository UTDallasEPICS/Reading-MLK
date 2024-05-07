import { PrismaClient } from '@prisma/client'
import { read } from 'fs'

const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
    
    const body = await readBody(event)

    let user = null
    let error = null

    // Check if all required fields are present in the request body
    if (body.firstName && body.lastName && body.email && body.role) {
        // Check if the user_name follows the specified pattern
        const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!usernameRegex.test(body.firstName + body.lastName)) {
            return createError({ statusCode: 400, statusMessage: "Invalid username format" });
        }

        try {
            // Create the user using Prisma
            user = await prisma.user.create({
                data: {
                    user_name: body.firstName + body.lastName,
                    email: body.email,
                    role: body.role,
                },
            });
        } catch (e) {
            error = e;
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
