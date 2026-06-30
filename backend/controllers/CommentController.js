import Comment from '../models/Comment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllComments = getAll(Comment);

export const createComment = createOne(Comment);

export const getComment = getOne(Comment, 'Comment');

export const updateComment = updateOne(Comment, 'Comment');

export const deleteComment = deleteOne(Comment, 'Comment');

export const getTeacherComments = asyncErrorHandler(async (req, res) => {
	const courses = await Course.find({ teacher: req.user._id }).select('_id');
	const courseIds = courses.map((c) => c._id);

	const lessons = await Lesson.find({ course: { $in: courseIds } }).select('_id');
	const lessonIds = lessons.map((l) => l._id);

	const comments = await Comment.find({ lesson: { $in: lessonIds } })
		.populate({ path: 'lesson', select: 'name course' })
		.populate({ path: 'user', select: 'name coverImage' })
		.populate({ path: 'replies.user', select: 'name coverImage' })
		.sort({ createdAt: -1 });

	res.status(200).json({
		status: 'success',
		count: comments.length,
		data: { docs: comments },
	});
});

export const replyOnComment = asyncErrorHandler(async (req, res) => {
	const { text } = req.body;

	if (!text || !text.trim()) throw new CustomError('text is required', 400);

	const comment = await Comment.findById(req.params.id);
	if (!comment) throw new CustomError('Comment not found', 404);

	comment.replies.push({ text: text.trim(), user: req.user._id });
	await comment.save();

	res.status(200).json({
		status: 'success',
		data: { comment },
	});
});

export const editReply = asyncErrorHandler(async (req, res) => {
	const { text } = req.body;
	if (!text || !text.trim()) throw new CustomError('text is required', 400);

	const comment = await Comment.findById(req.params.id);
	if (!comment) throw new CustomError('Comment not found', 404);

	const reply = comment.replies.id(req.params.replyId);
	if (!reply) throw new CustomError('Reply not found', 404);

	reply.text = text.trim();
	await comment.save();

	res.status(200).json({
		status: 'success',
		data: { comment },
	});
});

export const deleteReply = asyncErrorHandler(async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) throw new CustomError('Comment not found', 404);

	const reply = comment.replies.id(req.params.replyId);
	if (!reply) throw new CustomError('Reply not found', 404);

	reply.deleteOne();
	await comment.save();

	res.status(200).json({
		status: 'success',
		data: { comment },
	});
});
