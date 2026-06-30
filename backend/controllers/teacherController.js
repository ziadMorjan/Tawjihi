import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Comment from '../models/Comment.js';
import Review from '../models/Review.js';

const ONE_YEAR_AGO = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

export const getTeacherStats = asyncErrorHandler(async (req, res) => {
	const teacherId = req.user._id;

	const totalCourses = await Course.countDocuments({ teacher: teacherId });

	const teacherCourses = await Course.find({ teacher: teacherId }).select(
		'_id name averageRating',
	);
	const courseIds = teacherCourses.map((c) => c._id);

	const [totalStudents, ratingResult, enrollmentTrend, commentCounts, reviewsTrend] =
		await Promise.all([
			Enrollment.countDocuments({ course: { $in: courseIds } }),
			Course.aggregate([
				{ $match: { teacher: teacherId } },
				{ $group: { _id: null, averageRating: { $avg: '$averageRating' } } },
			]),
			Enrollment.aggregate([
				{ $match: { course: { $in: courseIds }, createdAt: { $gte: ONE_YEAR_AGO } } },
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
				{ $project: { _id: 0, month: '$_id', count: 1 } },
			]),
			Comment.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonData',
					},
				},
				{ $unwind: '$lessonData' },
				{ $match: { 'lessonData.course': { $in: courseIds } } },
				{ $group: { _id: '$lessonData.course', count: { $sum: 1 } } },
				{
					$lookup: {
						from: 'courses',
						localField: '_id',
						foreignField: '_id',
						as: 'course',
					},
				},
				{ $unwind: '$course' },
				{ $project: { _id: 0, name: '$course.name', count: 1 } },
				{ $sort: { count: -1 } },
			]),
			Review.aggregate([
				{
					$match: {
						course: { $in: courseIds },
						createdAt: { $gte: ONE_YEAR_AGO },
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
				{ $project: { _id: 0, month: '$_id', count: 1 } },
			]),
		]);

	const averageRating =
		ratingResult.length > 0 ? Math.round(ratingResult[0].averageRating * 100) / 100 : 0;

	const courseRatings = teacherCourses
		.filter((c) => c.averageRating > 0)
		.map((c) => ({ name: c.name, rating: Math.round(c.averageRating * 100) / 100 }));

	res.status(200).json({
		status: 'success',
		data: {
			totalCourses,
			totalStudents,
			averageRating,
			charts: {
				enrollmentTrend,
				courseRatings,
				commentCounts,
				reviewsTrend,
			},
		},
	});
});
