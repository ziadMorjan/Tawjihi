const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log(`MongoDB connected successfully : ${process.env.DB_NAME}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

module.exports = { connectDB };