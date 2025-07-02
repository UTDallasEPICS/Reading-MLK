import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, first_name, last_name, email, zipcode, yearly_income, birth_date, average_number_books, phone_number, gender, marital_stat, social_media} = body

    // Check for missing data
    if (!(id && zipcode && average_number_books && phone_number && gender && first_name && last_name && email)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let updatedParent = null;

    // Check if ID is provided
    if (id) {
        try {
            if (event.context.user?.user_role !== "parent") { // If user role is not parent, throws an error
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Forbidden',
                    message: 'You do not have permission to update parent profiles.'
                });
            }
            // Update existing parent record
            updatedParent = await prisma.parentProfile.update({
                where: {
                    id,
                },
                data: {
                    User: {
                        update: {
                            first_name,
                            last_name,
                            email,
                        }
                    },
                    zipcode,
                    yearly_income,
                    birth_date,
                    average_number_books,
                    phone_number,
                    gender,
                    marital_stat,
                    social_media,
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                console.log('You exeperienced this error code: ' + error.code, error.meta, error.message, ' If you would like to find what this error message means please refer to this link: https://www.prisma.io/docs/orm/reference/error-reference  ')
            }
            else if (error instanceof PrismaClientUnknownRequestError){
                console.log('Unknown error: ' , error.message)
            }
            throw createError({ statusCode: 500, statusMessage: "Error updating parent" });
        }
    }

    return updatedParent;
});
