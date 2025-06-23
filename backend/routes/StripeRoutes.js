const express = require('express');
const router = express.Router();
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const { createCheckoutSession } = require('../controllers/stripeController');

router.use(protect, allowedTo('user'));

router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
