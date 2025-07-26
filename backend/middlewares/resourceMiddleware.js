import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const checkResourceBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	const lesson = await Lesson.findById(req.params.lessonId);
	const course = await Course.findById(lesson.course);
	if (req.user.id !== course.teacher.id)
		throw new CustomError('This resource does not belong to you', 403);
	next();
});
