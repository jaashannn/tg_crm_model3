import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51Qp2CXP7TOZAXeMfSNGFbS1QARwxe4YApgc0uobmlQKwIL5o0m78zmuhqZxrfL0oXObajl153TNqmzBtufLIIphL00mx36ERKu');

export const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Stripe Webhook Endpoint (to receive payment details)
// app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         await Payment.create({
//             customerId: session.customer,
//             amount: session.amount_total / 100,
//             currency: session.currency,
//             status: session.payment_status,
//             createdAt: new Date(session.created * 1000),
//         });
//     }

//     res.json({ received: true });
// });
