import { loadStripe } from '@stripe/stripe-js';

// Get the publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key';

// For demo purposes, we'll use a placeholder key
// In production, you should set VITE_STRIPE_PUBLISHABLE_KEY in your environment

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  // Add other Stripe configuration options here
};
