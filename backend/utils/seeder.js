const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: '../config.env' });

connectDB(process.env.DB_URI);

User.create({
    name: 'Admin',
    email: 'admin@tawjihi.com',
    description: 'Admin user for the application',
    password: 'admin123',
    phone: '0591234567',
    role: 'admin',
    coverImage: 'admin-cover.jpg',
})
    .then(() => {
        console.log('Admin user created successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error creating admin user:', err);
        process.exit(-1);
    });
