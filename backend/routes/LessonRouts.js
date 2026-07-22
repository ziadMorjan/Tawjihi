import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	checkCourseBelongToTeacher,
	checkCourseBelongToTeacherInCreate,
	addCourseIdToReqBody,
	addCourseIdToReqQuery,
} from '../middlewares/lessonMiddleware.js';

import {
	createLessonValidator,
	getLessonValidator,
	updateLessonValidator,
	deleteLessonValidator,
} from '../utils/validators/lessonValidator.js';

import {
	getAllLessons,
	createLesson,
	getLesson,
	updateLesson,
	deleteLesson,
	uploadLessonVideo,
	handleVideo,
	reorderLessons,
} from '../controllers/LessonController.js';

import resourceRouts from './ResourceRouts.js';
import commentsRouts from './CommentRoutes.js';
import { getOrGenerateAIContent } from '../controllers/AIController.js';

const router = express.Router({ mergeParams: true });

router.use('/:lessonId/resources', resourceRouts);
router.use('/:lessonId/comments', commentsRouts);
router.post('/:lessonId/ai', protect, getOrGenerateAIContent);

router.patch('/reorder', protect, allowedTo('teacher'), reorderLessons);

router
	.route('/')
	.get(
		addCourseIdToReqQuery,
		(req, res, next) => {
			req.query.sort = req.query.sort || 'order';
			next();
		},
		getAllLessons,
	)
	.post(
		protect,
		allowedTo('teacher'),
		uploadLessonVideo,
		handleVideo,
		addCourseIdToReqBody,
		createLessonValidator,
		checkCourseBelongToTeacherInCreate,
		createLesson,
	);

router
	.route('/:id')
	.get(getLessonValidator, getLesson)
	.patch(
		protect,
		allowedTo('teacher'),
		checkCourseBelongToTeacher,
		uploadLessonVideo,
		handleVideo,
		addCourseIdToReqBody,
		updateLessonValidator,
		updateLesson,
	)
	.delete(
		protect,
		allowedTo('teacher'),
		addCourseIdToReqBody,
		checkCourseBelongToTeacher,
		deleteLessonValidator,
		deleteLesson,
	);

export default router;
