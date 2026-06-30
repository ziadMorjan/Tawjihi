import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { getTeacherStats } from '../controllers/teacherController.js';

const router = express.Router();

router.get('/stats', protect, allowedTo('teacher'), getTeacherStats);

export default router;
