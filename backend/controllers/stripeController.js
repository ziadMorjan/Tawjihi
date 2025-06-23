const Stripe = require('stripe');
const Course = require('../models/Course'); // Assuming you have a Course model
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
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
        success_url: 'http://localhost:3000/user/my-courses',
        cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({
        status: 'success',
        message: 'Checkout session created successfully',
        sessionUrl: session.url,
        sessionId: session.id
    });
};



module.exports = { createCheckoutSession };
