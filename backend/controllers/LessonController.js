import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVideoDurationInSeconds } from 'get-video-duration';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadLessonVideo = uploadSingleField('video');

export const handleVideo = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const { mimetype } = req.file;
		if (!mimetype.startsWith('video'))
			throw new CustomError(req.__('generic.invalid_file_type_for_video'), 400);

		const unique = crypto.randomUUID();
		const ext = mimetype.split('/')[1];
		const name = `lesson-${unique}-${Date.now()}.${ext}`;
		const uploadDir = path.join(__dirname, '..', 'uploads', 'lessons', 'videos');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, name);
		fs.writeFileSync(filePath, req.file.buffer);
		const duration = Math.round(await getVideoDurationInSeconds(filePath));
		req.body.duration = duration;

		req.upload = 'lesson';
		req.filePath = filePath;
	}
	next();
});

export const getAllLessons = getAll(Lesson);

export const createLesson = createOne(Lesson);

export const getLesson = getOne(Lesson, 'Lesson');

export const updateLesson = updateOne(Lesson, 'Lesson');

export const deleteLesson = deleteOne(Lesson, 'Lesson');
