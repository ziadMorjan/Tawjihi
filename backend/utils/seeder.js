// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const { fakerAR } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: '../config.env' });

const deleteAllUsers = async () => {
    try {
        await User.deleteMany({});
        console.log('All users deleted successfully');
    } catch (error) {
        console.error('Error deleting users:', error);
        process.exit(-1);
    }
}

async function seedAdmin() {
    try {
        await User.create({
            name: 'Admin',
            email: 'admin@tawjihi.com',
            description: 'Admin user for the application',
            password: 'admin123',
            phone: '0591234567',
            role: 'admin',
            coverImage: fakerAR.image.personPortrait(),
        });
        console.log('Admin created successfully');
    } catch (error) {

        console.error('Error creating admin :', error);
        process.exit(-1);
    }
}

async function seedUsers() {
    const generateUser = (gender) => {
        fakerAR.seed(Math.floor(Math.random() * 100000) + 1);
        const firstName = fakerAR.person.firstName(gender);
        const lastName = fakerAR.person.firstName(gender);
        return {
            name: `${firstName} ${lastName}`,
            email: fakerAR.internet.email({
                firstName,
                lastName,
                provider: "gmail.com",
                allowSpecialCharacters: false
            }),
            password: 12345678,
            Phone: fakerAR.phone.number(),
            coverImage: fakerAR.image.personPortrait(),
            role: "user",
            isActive: true
        };
    };

    let users = [];
    for (let i = 0; i < 10; i += 1) {
        users.push(generateUser(fakerAR.helpers.arrayElement(['male', 'female'])));
    }
    try {
        await User.create(users);
        console.log(`Users created successfully`);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(-1);
    }
}


async function seedTeachers() {

    const generateTeacher = (gender) => {
        fakerAR.seed(Math.floor(Math.random() * 100000) + 1);
        const firstName = fakerAR.person.firstName(gender);
        const lastName = fakerAR.person.lastName(gender);

        return {
            name: `${firstName} ${lastName}`,
            email: fakerAR.internet.email({
                firstName,
                lastName,
                provider: "gmail.com",
                allowSpecialCharacters: false
            }),
            description: fakerAR.lorem.sentence(),
            password: 12345678,
            phone: fakerAR.phone.number(),
            coverImage: fakerAR.image.personPortrait({ sex: gender }),
            cv: "https://res.cloudinary.com/tawhihi/raw/upload/v1752490269/files/cvs/ycvuuocuzzztsw9gh4t4.pdf",
            role: "teacher",
            isActive: true
        };
    };

    let teachers = [];
    for (let i = 0; i < 10; i += 1) {
        teachers.push(generateTeacher(fakerAR.helpers.arrayElement(['male', 'female'])));
    }
    try {
        await User.create(teachers);
        console.log(`Teachers created successfully`);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(-1);
    }
}

(async () => {
    await connectDB(process.env.DB_URI)
})();

(async () => {
    const mode = process.argv[2];
    if (!mode || (mode !== '-d' && mode !== '-i')) {
        console.error('Please provide a valid mode: -d to delete all users or -i to seed users');
        process.exit(-1);
    }
    try {
        if (mode === "-d") {
            await deleteAllUsers();
            process.exit(0);
        }
        else if (mode === "-i") {
            await seedAdmin();
            await seedUsers();
            await seedTeachers();
            process.exit(0);
        }
    } catch (error) {
        console.error('Error in seeding process:', error);
        process.exit(-1);
    }
})();
