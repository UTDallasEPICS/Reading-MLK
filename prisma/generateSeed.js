import { faker } from '@faker-js/faker';
import fs from 'fs';
import {defaultUsers, defaultAdmins} from './defaultCredentials.js';

const profileTypes = ["student", "parent", "faculty", "admin"];
const TOTAL_USERS = 1000;

const FAKER_SEED_VALUE = 123;
faker.seed(FAKER_SEED_VALUE);

function userProfile(idx) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const userName = `${firstName.slice(0, 1).toLowerCase()}${lastName.toLowerCase()}${idx}`;
    const preferred_name = faker.person.firstName();
    const email = faker.internet.email(firstName, lastName);

    return {
        user_name: userName,
        first_name: firstName,
        last_name: lastName,
        preferred_name: preferred_name,
        email: email,
    };
}

const studentProfile = (user_id, new_user) => {
    return {
        age: faker.number.int({ min: 5, max: 18 }),
        grade: faker.number.int({ min: 0, max: 12 }),
        reading_lvl: faker.number.int({ min: 1, max: 5 }),
        birth_date: faker.date.past(18),
        gender: faker.helpers.arrayElement(['Male', 'Female']),
        school_name: faker.company.name(),
        school_dist: faker.location.city(),
        pref_lang: faker.helpers.arrayElement(['English', 'Spanish', 'Other']),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName()
    }
}

const parentProfile = (user_id, new_user) => {
    return {
        zipcode: faker.location.zipCode(),
        yearly_income: faker.finance.amount(20000, 100000, 0),
        birth_date: faker.date.past(30),
        average_number_books: faker.number.int({ min: 0, max: 50 }),
        phone_number: faker.phone.number('(###)###-####'),
        gender: faker.helpers.arrayElement(['Male', 'Female']),
        marital_stat: faker.helpers.arrayElement(['Married', 'Single', 'Divorced']),
        social_media: faker.helpers.slugify(`${new_user.first_name.slice(0, 1).toLowerCase()}${new_user.last_name.toLowerCase()}${user_id}`),
        user_id: user_id,
    }
}

const facultyProfile = (user_id, new_user) => {
    return {
        district: faker.location.city(),
        dual_lang: faker.datatype.boolean(),
        faculty_email: faker.internet.email(new_user.first_name, new_user.last_name, 'school.com'),
        school_name: faker.company.name(),
        phone_number: faker.phone.number('(###)###-####'),
        department: faker.helpers.arrayElement(['Math', 'Science', 'English']),
        grade: faker.helpers.arrayElement(['1', '2', '3', '4']),
        user_id: user_id,
    }
}

const adminProfile = (user_id, new_user) => {
    return {
        admin_email: faker.internet.email(new_user.first_name, new_user.last_name, 'admin.com'),
        admin_id: user_id,
    }
}

function generateUsers() {
    const users = [...defaultUsers], students = [], parents = [], faculties = [], admins = [...defaultAdmins];

    const initial_length = users.length;

    for (let user_id = 1 + initial_length; user_id <= (TOTAL_USERS + initial_length); user_id++) {
        let new_user = userProfile(user_id);
        // 0-249: student
        if (user_id <= ((TOTAL_USERS)/profileTypes.length) + initial_length){
            new_user.role = "student";
            let student_user = studentProfile(user_id, new_user);
            // Object.assign(new_user, {Children: student_user});
            students.push(student_user);
        }
        // 250-499: parent
        else if (user_id <= (2*(TOTAL_USERS)/profileTypes.length) + initial_length){
            new_user.role = "parent";
            let parent_user = parentProfile(user_id, new_user);
            // Object.assign(new_user, {Parents: parent_user});
            parents.push(parent_user);
        }
        // 500-749: faculty
        else if (user_id <= (3*(TOTAL_USERS)/profileTypes.length) + initial_length){
            new_user.role = "faculty";
            let faculty_user = facultyProfile(user_id, new_user);
            // Object.assign(new_user, {Faculty: faculty_user});
            faculties.push(faculty_user);
        }
        // 750-999: admin
        else if (user_id <= (4*(TOTAL_USERS)/profileTypes.length) + initial_length){
            new_user.role = "admin";
            let admin_user = adminProfile(user_id, new_user);
            // Object.assign(new_user, {Admin: admin_user});
            admins.push(admin_user);
        }
        users.push(new_user);
    }
    return { Users: users, Students: students, Parents: parents, Faculties: faculties, Admins: admins };
}

function generateClasses() {
    const classes = [];
    for (let class_id = 1; class_id <= TOTAL_USERS/profileTypes.length; class_id++){
        const classYear = faker.date.past().getFullYear();
        const className = `${faker.word.adjective()} ${faker.word.noun()} Class`;
        classes.push({class_name: className, class_year: classYear});
    }
    return {Classes: classes};
}

function relateTeacherToClass(teachers, classes) {
    const teacherToClass = [];
    console.log("teach:", teachers.length)
    for (let i = 1; i <= classes.length; i++) {
        teacherToClass.push({
            class_id: i,
            teacher_id: Math.floor(Math.random() * teachers.length)+1,
        });
    }
    return teacherToClass;
}

function relateStudentToClass(students, classes) {
    const studentToClass = [];
    for (var i = 1; i <= classes.length; i++) {
        studentToClass.push({
            class_id: i,
            student_id: Math.floor(Math.random() * students.length)+1,
        });
    }
    return studentToClass;
}

function relateParentToChild(parents, children) {
    const parentToChild = [];
    for (var i = 1; i <= parents.length; i++) {
        parentToChild.push({
            child_id: i,
            parent_id: Math.floor(Math.random() * children.length)+1,
        });
    }
    return parentToChild;
}

function generateMain() {
    return {...generateUsers(), ...generateClasses()}
}

function relateMain() {
    const generated = generateMain();
    return {
        TeacherToClass: relateTeacherToClass(generated.Faculties, generated.Classes),
        StudentToClass: relateStudentToClass(generated.Students, generated.Classes),
        ParentToChild: relateParentToChild(generated.Parents, generated.Students),
    }
}

function masterMain() {
    return {...generateMain(), ...relateMain()}
}

const completeGeneratedList = masterMain();

fs.writeFile('./prisma/userData.json', JSON.stringify(completeGeneratedList.Users, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to userData.json');
    }
})

fs.writeFile('./prisma/studentData.json', JSON.stringify(completeGeneratedList.Students, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to studentData.json');
    }
})

fs.writeFile('./prisma/parentData.json', JSON.stringify(completeGeneratedList.Parents, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to parentData.json');
    }
})

fs.writeFile('./prisma/facultyData.json', JSON.stringify(completeGeneratedList.Faculties, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to facultyData.json');
    }
})

fs.writeFile('./prisma/adminData.json', JSON.stringify(completeGeneratedList.Admins, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to adminData.json');
    }
})

fs.writeFile('./prisma/classData.json', JSON.stringify(completeGeneratedList.Classes, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to classData.json');
    }
})

fs.writeFile('./prisma/teacherToClassData.json', JSON.stringify(completeGeneratedList.TeacherToClass, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to teacherToClassData.json');
    }
})

fs.writeFile('./prisma/studentToClassData.json', JSON.stringify(completeGeneratedList.StudentToClass, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to studentToClassData.json');
    }
})

fs.writeFile('./prisma/parentToChildData.json', JSON.stringify(completeGeneratedList.ParentToChild, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Users saved to parentToChildData.json');
    }
})