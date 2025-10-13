// Vercel serverless function for creating Stripe payment intents
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    const { amount, currency = 'usd' } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Amount must be a positive number.' });
    }

    if (amount > 999999) {
      return res.status(400).json({ error: 'Amount too large. Maximum amount is $9,999.99' });
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
