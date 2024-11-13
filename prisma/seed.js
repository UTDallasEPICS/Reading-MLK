import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import fs from 'fs';
import path from 'path';

const classSeed = [
    { class_name: 'Bayard Class', class_year: 2024 }, // id: 1
    { class_name: 'Tubman Class', class_year: 2026 }, // id: 2
    { class_name: 'Raeker Class', class_year: 2025 }, // id: 3
    { class_name: 'Perrau Class', class_year: 2029 }, // id: 4
];

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

    clearDatabase();

    // Reset auto-increment values for PostgreSQL
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false)`;
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('parent_profile', 'id'), 1, false)`;
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('faculty_profile', 'id'), 1, false)`;
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('student_profile', 'id'), 1, false)`;
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('admin_profile', 'id'), 1, false)`;
    await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('classes', 'id'), 1, false)`;

    // Seeding users
    await prisma.user.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedUsers.json'), 'utf8'))});

    // Seeding parent profiles
    await prisma.parentProfile.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedParents.json'), 'utf8')) });

    // Seeding faculty profiles
    await prisma.facultyProfile.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedFaculties.json'), 'utf8')), skipDuplicates: true });

    // Seeding student profiles
    await prisma.studentProfile.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedStudents.json'), 'utf8')), skipDuplicates: true });

    // Seeding admin profiles
    await prisma.adminProfile.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedAdmins.json'), 'utf8')), skipDuplicates: true });

    // Seeding classes
    await prisma.class.createMany({ data: JSON.parse(fs.readFileSync(path.resolve('./prisma/testedClasses.json'), 'utf8')), skipDuplicates: true });

    // Seeding TeacherToClass
    // await prisma.teacherToClass.createMany({ data: teacherToClassSeed, skipDuplicates: true });

    // // Seeding StudentToClass
    // await prisma.studentToClass.createMany({ data: studentToClassSeed, skipDuplicates: true });

    // // Seeding ParentToChild
    // await prisma.parentToChild.createMany({ data: parentToChildSeed, skipDuplicates: true });

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