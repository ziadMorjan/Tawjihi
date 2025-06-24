const express = require('express');
const router = express.Router();
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const { createCheckoutSessionValidator } = require("../utils/validators/paymentValidator");
const {
    createCheckoutSession,
    getPayments,
    getPayment,
} = require('../controllers/PaymentController');

router.use(protect);

router.route('/create-checkout-session')
    .post(
        allowedTo('user'),
        createCheckoutSessionValidator,
        createCheckoutSession
    );

router.route("/")
    .get(getPayments);


router.route("/:id")
    .get(getPayment);

module.exports = router;
