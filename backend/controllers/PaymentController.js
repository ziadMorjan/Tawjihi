const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Course = require('../models/Course');
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const { getAll, getOne } = require("./controller");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");

const getPayments = getAll(Payment);

const getPayment = getOne(Payment, "Payment");

const createCheckoutSession = asyncErrorHandler(async (req, res) => {
    const { ids } = req.body;
    let promises = ids.map(id => Course.findById(id));
    let courses = await Promise.all(promises);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: courses.map(item => ({
            price_data: {
                currency: 'ils',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: 1,
        })),
        metadata: {
            courses: ids.join(" "),
            user: req.user.id,
        },
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/user/my-courses`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(201).json({
        status: 'success',
        sessionUrl: session.url,
    });
});

const webhook = asyncErrorHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { metadata } = session;
        const ids = metadata.courses.split(" ");

        // 1- create payment record
        await Payment.create({ user: metadata.user, amount: (session.amount_total / 100) });

        // 2- create enrollments
        const promises = ids.map(id => Enrollment.create({ user: metadata.user, course: id }));
        await Promise.all(promises);

        // 3- remove courses from cart
        const cart = await Cart.findOne({ user: metadata.user });
        if (cart) {
            cart.courses = cart.courses.filter(course => !ids.includes(course.id));
            cart.totalPrice = cart.courses.reduce((total, course) => total + course.price, 0);
            await cart.save();
        }
    }

    res.status(200).json({ status: "Received" });
});

module.exports = {
    getPayments,
    getPayment,
    createCheckoutSession,
    webhook
};
