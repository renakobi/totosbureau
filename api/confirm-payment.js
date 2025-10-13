// Vercel serverless function for confirming Stripe payments
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientSecret, paymentMethodId } = req.body;

    if (!clientSecret || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (paymentIntent.status === 'succeeded') {
      res.status(200).json({
        success: true,
        paymentIntent,
        message: 'Payment successful',
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed',
        paymentIntent,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
}


