import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url'; // 👈 Add this import
import Course from '../models/Course.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

// --- Recreate __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Gets the file path
const __dirname = path.dirname(__filename); // Gets the directory path

export const uploadCourseImage = uploadSingleField('coverImage');

export const handleCourseImage = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const unique = crypto.randomUUID();
		const name = `course-${unique}-${Date.now()}.jpeg`;

		// Now __dirname is defined and works correctly
		const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'courses');

		// Ensure directory exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, name);
		const buffer = await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toBuffer();

		fs.writeFileSync(filePath, buffer);
		req.upload = 'course';
		req.filePath = filePath;
	}
	next();
});

export const getAllCourses = getAll(Course);

export const createCourse = createOne(Course);

export const getCourse = getOne(Course, 'Course');

export const updateCourse = updateOne(Course, 'Course');

export const deleteCourse = deleteOne(Course, 'Course');
