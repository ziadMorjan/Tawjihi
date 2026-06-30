import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import Subject from '../models/Subject.js';

const ONE_YEAR_AGO = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

export const getAdminStats = asyncErrorHandler(async (req, res) => {
	const [
		totalUsers,
		totalStudents,
		totalTeachers,
		totalCourses,
		revenueResult,
		revenueTrend,
		enrollmentTrend,
		userGrowthResult,
		topCoursesResult,
		ratingDistResult,
		subjectDistResult,
		roleDistResult,
		activeResult,
	] = await Promise.all([
		User.countDocuments(),
		User.countDocuments({ role: 'user' }),
		User.countDocuments({ role: 'teacher' }),
		Course.countDocuments(),
		Payment.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$amount' } } }]),
		Payment.aggregate([
			{ $match: { createdAt: { $gte: ONE_YEAR_AGO } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
					total: { $sum: '$amount' },
				},
			},
			{ $sort: { _id: 1 } },
			{ $project: { _id: 0, month: '$_id', total: 1 } },
		]),
		Enrollment.aggregate([
			{ $match: { createdAt: { $gte: ONE_YEAR_AGO } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{ $project: { _id: 0, month: '$_id', count: 1 } },
		]),
		User.aggregate([
			{ $match: { createdAt: { $gte: ONE_YEAR_AGO } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
			{ $project: { _id: 0, month: '$_id', count: 1 } },
		]),
		Enrollment.aggregate([
			{ $group: { _id: '$course', enrollmentCount: { $sum: 1 } } },
			{ $sort: { enrollmentCount: -1 } },
			{ $limit: 10 },
			{
				$lookup: {
					from: 'courses',
					localField: '_id',
					foreignField: '_id',
					as: 'course',
				},
			},
			{ $unwind: '$course' },
			{ $project: { _id: 1, name: '$course.name', enrollmentCount: 1 } },
		]),
		Course.aggregate([
			{
				$bucket: {
					groupBy: '$averageRating',
					boundaries: [0, 1, 2, 3, 4, 5],
					default: 'بدون تقييم',
					output: { count: { $sum: 1 } },
				},
			},
			{ $project: { range: '$_id', count: 1, _id: 0 } },
		]),
		Course.aggregate([
			{ $group: { _id: '$subject', count: { $sum: 1 } } },
			{
				$lookup: {
					from: 'subjects',
					localField: '_id',
					foreignField: '_id',
					as: 'subject',
				},
			},
			{ $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
			{ $project: { name: { $ifNull: ['$subject.name', 'بدون مادة'] }, count: 1, _id: 0 } },
			{ $sort: { count: -1 } },
		]),
		User.aggregate([
			{ $group: { _id: '$role', count: { $sum: 1 } } },
			{ $project: { role: '$_id', count: 1, _id: 0 } },
		]),
		User.aggregate([
			{
				$group: {
					_id: '$isActive',
					count: { $sum: 1 },
				},
			},
			{ $project: { status: { $cond: ['$_id', 'نشط', 'غير نشط'] }, count: 1, _id: 0 } },
		]),
	]);

	const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

	res.status(200).json({
		status: 'success',
		data: {
			totalUsers,
			totalStudents,
			totalTeachers,
			totalCourses,
			totalRevenue,
			charts: {
				revenueTrend,
				enrollmentTrend,
				userGrowth: userGrowthResult,
				topCourses: topCoursesResult,
				ratingDistribution: ratingDistResult,
				subjectDistribution: subjectDistResult,
				userRoleDistribution: roleDistResult,
				activeInactive: activeResult,
			},
		},
	});
});
