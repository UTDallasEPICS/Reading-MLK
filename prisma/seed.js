import { PrismaClient } from '@prisma/client';
import {config} from 'dotenv';
config({ path: '.env' }); // Load environment variables from .env file
const prisma = new PrismaClient();

import fs from 'fs';
import path from 'path';

const teacherToClassSeed = [
    { class_id: 1, teacher_id: 1 },
    { class_id: 2, teacher_id: 2 },
    { class_id: 3, teacher_id: 1 },
    { class_id: 4, teacher_id: 2 },
];

const studentToClassSeed = [
    { class_id: 1, student_id: 2 },
    { class_id: 2, student_id: 1 },
];

const parentToChildSeed = [
    { parent_id: 1, child_id: 1 },
    { parent_id: 2, child_id: 2 },
];

async function clearDatabase() {
    try {
        // Delete data from all tables in the correct order to avoid foreign key issues
        await prisma.teacherToClass.deleteMany({});
        await prisma.studentToClass.deleteMany({});
        await prisma.parentToChild.deleteMany({});
        await prisma.class.deleteMany({});
        await prisma.parentProfile.deleteMany({});
        await prisma.facultyProfile.deleteMany({});
        await prisma.studentProfile.deleteMany({});
        await prisma.adminProfile.deleteMany({});
        await prisma.user.deleteMany({});       
        
        // Add any other tables here as needed
        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}


async function main() {

    await clearDatabase();

    // Reset auto-increment values for PostgreSQL
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false)`;
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('parent_profile', 'id'), 1, false)`;
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('faculty_profile', 'id'), 1, false)`;
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('student_profile', 'id'), 1, false)`;
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('admin_profile', 'id'), 1, false)`;
    //await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('classes', 'id'), 1, false)`;
    const adminUser =   {
        "user_name": "mfarrell3",
        "first_name": "Maurine",
        "last_name": "Farrell",
        "preferred_name": "Katlyn",
        "email": process.env.DEV_EMAIL,
        "role": "admin",
        Admin:{
            // create: {
            // admin_email: process.env.DEV_EMAIL,
            // }
        }
    }
    const parentUser =   {
        "user_name": "ParentTest",
        "first_name": "Parent",
        "last_name": "Test",
        "preferred_name": "parent",
        "email": "parent@gmail.com",
        "role": "parent",
        Parents:{
            create: {
            "zipcode": "53375",
            "yearly_income": "170.11",
            "birth_date": "2024-08-31T06:09:42.427Z",
            "average_number_books": 15,
            "phone_number": "(583) 601-7432 x403",
            "gender": "Female",
            "marital_stat": "Married",
            "social_media": "hnicolas253",
        }}
    }
    const facultyUser =   {
        "user_name": "FacultyTest",
        "first_name": "Faculty",
        "last_name": "Test",
        "preferred_name": "teacher",
        "email": "faculty@gmail.com",
        "role": "faculty",
        Faculty:{
            create: {
            "district": "53375",
            "dual_lang": true,
            "faculty_email": "faculty@gmail.com",
            "school_name": "Lemke - Lemke",
            "phone_number": "(583) 601-7432 x403",
            "department": "Math",
            "grade": "5th"
        }}
    }
    // const studentUser =   {
    //     "user_name": "StudentTest",
    //     "first_name": "Student",
    //     "last_name": "Test",
    //     "preferred_name": "student",
    //     "email": "student@gmail.com",
    //     "role": "student",
    //     Student:{
    //         create: {
    //         "grade": "5th",
    //         "student_email": "student@gmail.com",
    //         "school_name": "Lemke - Lemke",
    //         "phone_number": "(583) 601-7432 x403",
    //         "birth_date": "2024-08-31T06:09:42.427Z",
    //         "gender": "Female",
    //         "social_media": "hnicolas253",
    //     }}
    // }

    // Seeding users
    // TODO: parent/faculty/student/admin data gets seeded as part of the user data, see https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes
    await prisma.user.create({ data: facultyUser });
    await prisma.user.create({ data: adminUser });
    await prisma.user.create({ data: parentUser });
    // await prisma.user.create({ data: studentUser });
    // Seeding classes
    //await prisma.class.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/classData.json'), 'utf8')), skipDuplicates: true });

    // Seeding TeacherToClass
   // await prisma.teacherToClass.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/teacherToClassData.json'), 'utf8')), skipDuplicates: true });

    // Seeding StudentToClass
    //await prisma.studentToClass.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/studentToClassData.json'), 'utf8')), skipDuplicates: true });

    // Seeding ParentToChild
    //await prisma.parentToChild.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/parentToChildData.json'), 'utf8')), skipDuplicates: true });

    console.log('Database seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });