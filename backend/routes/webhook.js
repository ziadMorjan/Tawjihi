const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Enrollment = require("../models/Enrollment");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
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

        const promises = ids.map(id => Enrollment.Create({ user: session.client_reference_id, course: id }));
        await Promise.all(promises);
    }

    res.status(200).json({ status: "Received" });
});

module.exports = router;
