import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	if (req.user.role === 'teacher') {
		const course = await Course.findById(req.params.id);
		if (req.user.id !== course.teacher.id)
			throw new CustomError(req.__('courses.course_does_not_belong_to_you'), 403);
	}
	next();
});
