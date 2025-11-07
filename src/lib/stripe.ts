import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  // Add your secret key here for server-side operations (keep it secure!)
  // secretKey: process.env.REACT_APP_STRIPE_SECRET_KEY,
};

// Domain configuration
export const domainConfig = {
  production: 'https://totosbureau.com',
  development: 'http://localhost:8080',
  current: process.env.NODE_ENV === 'production' ? 'https://totosbureau.com' : 'http://localhost:8080'
};

// Helper function to create payment intent
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Helper function to handle payment
export const handlePayment = async (stripe: any, elements: any, clientSecret: string) => {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      console.error('Payment failed:', error);
      return { success: false, error };
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      return { success: true, paymentIntent };
    }

    return { success: false, error: 'Payment not completed' };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error };
  }
};
