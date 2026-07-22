import Enrollment from '../models/Enrollment.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllEnrollments = getAll(Enrollment, {
	path: 'course',
	select: 'name img teacher',
	populate: {
		path: 'teacher',
		select: 'name',
	},
});
export const createEnrollment = createOne(Enrollment);

export const getEnrollment = getOne(Enrollment, 'enrollment');

export const updateEnrollment = updateOne(Enrollment, 'enrollment');

export const deleteEnrollment = deleteOne(Enrollment, 'enrollment');

export const markLessonProgress = asyncErrorHandler(async (req, res) => {
	const { lessonId, completed } = req.body;
	const { courseId } = req.params;

	if (!lessonId) throw new CustomError('lessonId مطلوب', 400);

	const enrollment = await Enrollment.findOne({
		user: req.user._id,
		course: courseId,
	});

	if (!enrollment) throw new CustomError('غير مشترك في هذا الكورس', 403);

	if (completed) {
		// أضف إن لم يكن موجوداً
		if (!enrollment.completedLessons.includes(lessonId)) {
			enrollment.completedLessons.push(lessonId);
		}
	} else {
		// أزل
		enrollment.completedLessons = enrollment.completedLessons.filter(
			(id) => id.toString() !== lessonId,
		);
	}

	await enrollment.save();

	res.status(200).json({
		status: 'success',
		data: { completedLessons: enrollment.completedLessons },
	});
});
