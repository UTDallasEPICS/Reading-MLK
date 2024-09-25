import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const userSeed = [
    { user_name: 'User1', first_name: "Jack", last_name: "Renshaul", private_email: 'user1@example.com', client_cuid: 'cuid1', role: 'parent' },
    { user_name: 'User2', first_name: "Ben", last_name: "Mycor", private_email: 'user2@example.com', client_cuid: 'cuid2', role: 'student' },
    { user_name: 'User3', first_name: "Allie", last_name: "Poileer", private_email: 'user3@example.com', client_cuid: 'cuid3', role: 'faculty' },
    { user_name: 'User4', first_name: "Cathy", last_name: "Uvidu", private_email: 'user4@example.com', client_cuid: 'cuid4', role: 'Admin' },

    { user_name: 'User5', first_name: "Rebbie", last_name: "Quaker", private_email: 'user5@example.com', client_cuid: 'cuid5', role: 'parent' },
    { user_name: 'User6', first_name: "Moira", last_name: "Arrow", private_email: 'user6@example.com', client_cuid: 'cuid6', role: 'student' },
    { user_name: 'User7', first_name: "Ted", last_name: "Skempy", private_email: 'user7@example.com', client_cuid: 'cuid7', role: 'faculty' },
    { user_name: 'User8', first_name: "Aron", last_name: "Vaighut", private_email: 'user8@example.com', client_cuid: 'cuid8', role: 'Admin' },

    { user_name: 'Jek200000', first_name: "Jonathan Ernest", last_name: "Kopuri", private_email: 'kjernest01@gmail.com', client_cuid: 'cuid8', role: 'Admin' },
    { user_name: 'Dtn210005', first_name: "Duc Trung", last_name: "Nguyen", private_email: 'ductrungnguyen20034@gmail.com', client_cuid: 'cuid9', role: 'Admin' },
    { user_name: 'Tlb210005', first_name: "Taylor Liling", last_name: "Beers", private_email: 'tlb210005@utdallas.edu', client_cuid: 'cuid10', role: 'Admin' },
    { user_name: 'Bnt220000', first_name: "Bilal Nail", last_name: "Tulek", private_email: 'bilaltulek0@gmail.com', client_cuid: 'cuid11', role: 'Admin' },
    { user_name: 'Txm210043', first_name: "Thanmai", last_name: "Mandala", private_email: 'mandalathanmai@gmail.com', client_cuid: 'cuid12', role: 'Admin' },
    { user_name: 'Rxu210009', first_name: "Rishil", last_name: "Uppalaru", private_email: 'rishil.u@gmail.com', client_cuid: 'cuid13', role: 'Admin' },
    { user_name: 'Mxs210181', first_name: "Mira", last_name: "Shan", private_email: 'mxs210181@utdallas.edu', client_cuid: 'cuid14', role: 'Admin' },
    { user_name: 'Oxs200002', first_name: "Ofek", last_name: "Shaltiel", private_email: 'ofekjshaltiel@gmail.com', client_cuid: 'cuid15', role: 'Admin' },
];

const parentProfileSeed = [
    // id: 1
    {
        zipcode: '75001',
        yearly_income: '80000',
        birth_date: new Date('1980-01-01'),
        average_number_books: 20,
        phone_number: '555-555-1111',
        gender: 'F',
        user_id: 1
    },
    // id: 2
    {
        zipcode: '75002',
        yearly_income: null,
        birth_date: new Date('1975-01-01'),
        average_number_books: 10,
        phone_number: '555-555-2222',
        gender: 'M',
        user_id: 5
    },
];

const facultyProfileSeed = [
    // id: 1
    {
        district: 'GISD',
        dual_lang: true,
        faculty_email: 'faculty1@example.com',
        school_name: 'Elementary School 1',
        phone_number: '555-555-3333',
        department: 'Science',
        grade: '5',
        user_id: 3
    },
    // id: 2
    {
        district: 'RISD',
        dual_lang: false,
        faculty_email: 'faculty2@example.com',
        school_name: 'Elementary School 2',
        phone_number: '555-555-4444',
        department: 'Math',
        grade: '3',
        user_id: 7
    },
];

const studentProfileSeed = [
    // id: 1
    {
        age: 7,
        grade: 2,
        reading_lvl: 1,
        birth_date: new Date('2015-01-01'),
        gender: 'M',
        school_name: 'GISD Elementary',
        school_dist: 'GISD',
        pref_lang: 'English',
        user_id: 2
    },
    // id: 2
    {
        age: 6,
        grade: 1,
        reading_lvl: 0,
        birth_date: new Date('2016-01-01'),
        gender: 'F',
        school_name: 'RISD Elementary',
        school_dist: 'RISD',
        pref_lang: 'Spanish',
        user_id: 6
    },
];

const adminProfileSeed = [
    { admin_email: 'admin1@example.com', admin_id: 4 }, // id: 1
    { admin_email: 'admin2@example.com', admin_id: 8 }, // id: 2
];

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


async function main() {

    // Seeding users
    await prisma.user.createMany({ data: userSeed, skipDuplicates: true });

    // Seeding parent profiles
    await prisma.parentProfile.createMany({ data: parentProfileSeed, skipDuplicates: true });

    // Seeding faculty profiles
    await prisma.facultyProfile.createMany({ data: facultyProfileSeed, skipDuplicates: true });

    // Seeding student profiles
    await prisma.studentProfile.createMany({ data: studentProfileSeed, skipDuplicates: true });

    // Seeding admin profiles
    await prisma.adminProfile.createMany({ data: adminProfileSeed, skipDuplicates: true });

    // Seeding classes
    await prisma.class.createMany({ data: classSeed, skipDuplicates: true });

    // Seeding TeacherToClass
    await prisma.teacherToClass.createMany({ data: teacherToClassSeed, skipDuplicates: true });

    // Seeding StudentToClass
    await prisma.studentToClass.createMany({ data: studentToClassSeed, skipDuplicates: true });

    // Seeding ParentToChild
    await prisma.parentToChild.createMany({ data: parentToChildSeed, skipDuplicates: true });

    console.log('Database seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });