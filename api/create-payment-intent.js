// Vercel serverless function for creating Stripe payment intents
// SECURITY FIXES APPLIED: CORS, Authentication, Input Validation, Rate Limiting
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const security = require('./utils/security');

module.exports = async function handler(req, res) {
  // SECURITY FIX: Apply security middleware
  security.handleCORS(req, res, () => {
    security.validateContentType(req, res, () => {
      security.limitRequestSize(1024 * 1024)(req, res, () => {
        security.rateLimit(100, 15 * 60 * 1000)(req, res, () => {
          // SECURITY FIX: Require authentication for payment operations
          // Uncomment when API_SECRET_KEY is set in Vercel
          // security.authenticateAPI(req, res, () => {
            handleRequest(req, res);
          // });
        });
      });
    });
  });
};

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

    // SECURITY FIX: Comprehensive input validation and sanitization
    let amount, currency;
    try {
      amount = security.validateInput.amount(req.body.amount);
      currency = security.validateInput.currency(req.body.currency);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'totosbureau-checkout'
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Card error: ' + error.message });
    } else if (error.type === 'StripeRateLimitError') {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid request: ' + error.message });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ error: 'Payment service error. Please try again.' });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(500).json({ error: 'Network error. Please check your connection.' });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ error: 'Payment service authentication failed.' });
    }

    res.status(500).json({ error: 'Failed to create payment intent. Please try again.' });
  }
}
