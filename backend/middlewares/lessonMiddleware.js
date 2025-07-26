import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const checkCourseBelongToTeacherInCreate = asyncErrorHandler(async (req, res, next) => {
	const course = await Course.findById(req.body.course);
	if (req.user.id !== course.teacher.id)
		throw new CustomError('You can not add lectures, This course does not belong to you', 403);
	next();
});

export const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	const lesson = await Lesson.findById(req.params.id);
	const course = await Course.findById(lesson.course);
	if (req.user.id !== course.teacher.id)
		throw new CustomError('This lessons belong to course that does not belong to you', 403);
	next();
});

export const addCourseIdToReqBody = (req, res, next) => {
	if (req.params.courseId) req.body.course = req.params.courseId;
	next();
};

export const addCourseIdToReqQuery = (req, res, next) => {
	if (req.params.courseId) req.query.course = req.params.courseId;
	next();
};
