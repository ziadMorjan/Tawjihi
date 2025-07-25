import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: './config.env' });

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log(`MongoDB connected successfully : ${process.env.DB_NAME}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export { connectDB };