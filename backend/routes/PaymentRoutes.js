import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import { createCheckoutSessionValidator } from '../utils/validators/paymentValidator.js';

import {
	createCheckoutSession,
	getPayments,
	getPayment,
} from '../controllers/PaymentController.js';

const router = express.Router();

router.use(protect);

router
	.route('/create-checkout-session')
	.post(allowedTo('user'), createCheckoutSessionValidator, createCheckoutSession);

router.route('/').get(getPayments);

router.route('/:id').get(getPayment);

export default router;
