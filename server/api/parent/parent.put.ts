import { PrismaClient } from '@prisma/client';
import { read } from 'fs';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const id = body.id;
    const zipcode = body.zipcode;
    const yearly_income = body.yearly_income;
    const birth_date = body.birth_date;
    const avg_num_book = body.avg_num_book;
    const password = body.password;
    const phone_number = body.phone_number;
    const gender = body.gender;
    const marital_stat = body.marital_stat;
    const first_name = body.first_name;
    const last_name = body.last_name;
    const email = body.email;
    const social_media = body.social_media;

    // Check for missing data
    if (!(id && zipcode && avg_num_book && password && phone_number && gender && first_name && last_name && email)) {
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
                    avg_num_book: avg_num_book,
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
            console.error('Error updating parent:', error);
            throw createError({ statusCode: 500, statusMessage: "Error updating parent" });
        }
    }

    return parent;
});
