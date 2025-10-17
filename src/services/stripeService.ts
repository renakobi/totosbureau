// Stripe service for handling payment processing
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is required');
}

export const stripePromise = loadStripe(stripePublishableKey);

// Payment intent creation
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (amount > 999999) {
      throw new Error('Payment amount too large');
    }

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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to create payment intent`);
    }

    const { clientSecret } = await response.json();
    
    if (!clientSecret) {
      throw new Error('No client secret received from server');
    }

    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      if (error.message.includes('Invalid payment amount')) {
        throw new Error('Please enter a valid payment amount.');
      }
      if (error.message.includes('amount too large')) {
        throw new Error('Payment amount is too large. Please contact support.');
      }
    }
    
    throw error;
  }
};

// Confirm payment
export const confirmPayment = async (clientSecret: string, paymentMethodId: string) => {
  try {
    const response = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSecret,
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (paymentData: {
  customerEmail: string;
  amount: number;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}) => {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!paymentData.customerEmail || !emailRegex.test(paymentData.customerEmail)) {
      throw new Error('Invalid email address');
    }

    // Validate required fields
    if (!paymentData.orderId || !paymentData.amount || !paymentData.items?.length) {
      throw new Error('Missing required payment data');
    }

    const response = await fetch('/api/send-payment-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to send confirmation email`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending payment email:', error);
    
    // Don't throw error for email failures - payment should still succeed
    if (error instanceof Error) {
      console.warn('Email notification failed:', error.message);
    }
    
    // Return a success response even if email fails
    return { success: false, message: 'Email notification failed but payment was successful' };
  }
};

// Stripe configuration
export const stripeConfig = {
  publishableKey: stripePublishableKey,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0f172a',
      colorBackground: '#ffffff',
      colorText: '#0f172a',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};
