// Vercel serverless function for confirming Stripe payments
// SECURITY FIXES APPLIED: CORS, Authentication, Input Validation, Rate Limiting
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const security = require('./utils/security');

module.exports = async function handler(req, res) {
  // SECURITY FIX: Apply security middleware
  security.handleCORS(req, res, () => {
    security.validateContentType(req, res, () => {
      security.limitRequestSize(1024 * 1024)(req, res, () => {
        security.rateLimit(50, 15 * 60 * 1000)(req, res, () => {
          // SECURITY FIX: Require authentication for payment operations
          // Uncomment when API_SECRET_KEY is set in Vercel
           security.authenticateAPI(req, res, () => {
            handleRequest(req, res);
          // });
        });
      });
    });
  });
});

async function handleRequest(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    // SECURITY FIX: Comprehensive input validation
    let clientSecret, paymentMethodId;
    try {
      clientSecret = security.validateInput.clientSecret(req.body.clientSecret);
      paymentMethodId = security.validateInput.paymentMethodId(req.body.paymentMethodId);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
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

}
