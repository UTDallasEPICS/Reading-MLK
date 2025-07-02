import { PrismaClient } from '@prisma/client'
import { read } from 'fs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    try {
        // Check if the user has permission to create a user profile
        if (event.context.user?.user_role !== "parent") {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'You do not have permission to create a user profile.'
            });
        }
    } catch (e) {
        console.error('Error checking user role:', e);
        throw createError({ statusCode: 500, statusMessage: "Error checking user role" });
    }

    let user = null
    let error = null

    if (!body.user) {
        throw createError({ statusCode: 400, statusMessage: "user data" });
    }

    if (!body.user.user_name || !body.user.first_name || !body.user.last_name || !body.user.email || !body.user.role) {
        throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
    }

    console.log(body)

    const {user_name, first_name, last_name, preferred_name, email, role} = body

    // Check if all required fields are present in the request body
    if (body.user.first_name && body.user.last_name && body.user.email && body.user.role) {
        try {
            // Create the user using Prisma
            user = await prisma.user.create({
                data: {
                    user_name,
                    first_name,
                    last_name,
                    preferred_name,
                    email,
                    role,
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
