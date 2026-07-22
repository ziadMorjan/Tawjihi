import { Readable } from 'stream';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const uploadLessonVideo = uploadSingleField('video');

// Helper: رفع buffer على Cloudinary كـ stream
const uploadToCloudinary = (buffer, options) =>
	new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
			if (error) reject(error);
			else resolve(result);
		});
		// eslint-disable-next-line node/no-unsupported-features/node-builtins
		Readable.from(buffer).pipe(stream);
	});

export const handleVideo = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const { mimetype, buffer } = req.file;
		if (!mimetype.startsWith('video'))
			throw new CustomError(req.__('generic.invalid_file_type_for_video'), 400);

		const result = await uploadToCloudinary(buffer, {
			resource_type: 'video',
			folder: 'tawjihi/lessons/videos',
			chunk_size: 6000000, // 6MB chunks for large videos
		});

		req.body.video = result.secure_url;
		req.body.duration = Math.round(result.duration ?? 0);
	}
	next();
});

export const reorderLessons = asyncErrorHandler(async (req, res) => {
	const { courseId, lessons } = req.body;
	// lessons: [{ _id: string, order: number }]

	if (!courseId || !Array.isArray(lessons) || lessons.length === 0)
		throw new CustomError('بيانات غير صالحة', 400);

	// التحقق أن الكورس يخص المعلم
	const course = await Course.findById(courseId);
	if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
	if (req.user.id !== course.teacher.id)
		throw new CustomError(req.__('lessons.lesson_on_unowned_course'), 403);

	const bulkOps = lessons.map(({ _id, order }) => ({
		updateOne: {
			filter: { _id, course: courseId },
			update: { $set: { order } },
		},
	}));

	await Lesson.bulkWrite(bulkOps, { ordered: false });

	res.status(200).json({ status: 'success', message: 'تم إعادة الترتيب بنجاح' });
});

export const getAllLessons = getAll(Lesson);
export const createLesson = createOne(Lesson);
export const getLesson = getOne(Lesson, 'Lesson');
export const updateLesson = updateOne(Lesson, 'Lesson');
export const deleteLesson = deleteOne(Lesson, 'Lesson');
