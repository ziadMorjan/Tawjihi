import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	addUserIdToReqBody,
	addLessonIdToReqBody,
	checkCommentBelongToUser,
	checkCourseBelongToTeacher,
	addLessonIdToReqQuery,
} from '../middlewares/commentMiddleware.js';

import {
	createCommentValidator,
	getCommentValidator,
	updateCommentValidator,
	deleteCommentValidator,
} from '../utils/validators/commentValidator.js';

import {
	getAllComments,
	createComment,
	getComment,
	updateComment,
	deleteComment,
	replyOnComment,
	getTeacherComments,
	editReply,
	deleteReply,
} from '../controllers/CommentController.js';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(addLessonIdToReqQuery, getAllComments)
	.post(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addLessonIdToReqBody,
		createCommentValidator,
		createComment,
	);

router.get('/teacher', protect, allowedTo('teacher'), getTeacherComments);

router.post('/:id/reply', protect, allowedTo('teacher'), replyOnComment);

router.patch('/:id/replies/:replyId', protect, allowedTo('teacher'), editReply);
router.delete('/:id/replies/:replyId', protect, allowedTo('teacher'), deleteReply);

router
	.route('/:id')
	.get(getCommentValidator, getComment)
	.patch(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addLessonIdToReqBody,
		checkCommentBelongToUser,
		updateCommentValidator,
		updateComment,
	)
	.delete(
		protect,
		allowedTo('user', 'teacher'),
		addLessonIdToReqBody,
		checkCommentBelongToUser,
		checkCourseBelongToTeacher,
		deleteCommentValidator,
		deleteComment,
	);

export default router;
