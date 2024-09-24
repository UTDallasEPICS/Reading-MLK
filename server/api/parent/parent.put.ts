import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const zipcode = body.zipcode;
    const yearly_income = body.yearly_income;
    const birth_date = body.birth_date;
    const average_number_books = body.average_number_books;
    const password = body.password;
    const phone_number = body.phone_number;
    const gender = body.gender;
    const marital_stat = body.marital_stat;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;
    const social_media = body.social_media;

    // Check for missing data
    if (!(id && zipcode && average_number_books && password && phone_number && gender && first_name && last_name && email)) {
        return createError({ statusCode: 400, statusMessage: "Missing Data" });
    }

    let parent = null;

    // Check if ID is provided
    if (id) {
        try {
            // Update existing parent record
            parent = await prisma.parentProfile.update({
                where: {
                    id: id
                },
                data: {
                    zipcode: zipcode,
                    yearly_income: yearly_income,
                    birth_date: birth_date,
                    average_number_books: average_number_books,
                    password: password,
                    phone_number: phone_number,
                    gender: gender,
                    marital_stat: marital_stat,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    social_media: social_media
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

    return parent;
});
