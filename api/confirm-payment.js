
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const security = require('./utils/security');

module.exports = async function handler(req, res) {
  security.handleCORS(req, res, () => {
    security.validateContentType(req, res, () => {
      security.limitRequestSize(1024 * 1024)(req, res, () => {
        security.rateLimit(50, 15 * 60 * 1000)(req, res, () => {
    
           security.authenticateAPI(req, res, () => {
            handleRequest(req, res);
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
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    let clientSecret, paymentMethodId;
    try {
      clientSecret = security.validateInput.clientSecret(req.body.clientSecret);
      paymentMethodId = security.validateInput.paymentMethodId(req.body.paymentMethodId);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

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
