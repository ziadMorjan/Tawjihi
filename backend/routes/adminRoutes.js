import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protect, allowedTo('admin'), getAdminStats);

export default router;
