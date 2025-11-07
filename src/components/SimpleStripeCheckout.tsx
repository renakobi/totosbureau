import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, CheckCircle, XCircle, Lock } from 'lucide-react';

// Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Payment form component
const PaymentForm = ({ amount, onSuccess, onError, initialEmail = '' }: {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
  initialEmail?: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [cardElementReady, setCardElementReady] = useState(false);

  // Update email when initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  console.log('🔍 PaymentForm Status:', { 
    stripe: !!stripe, 
    elements: !!elements, 
    amount,
    email 
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      console.log('❌ Stripe not ready');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Creating payment intent...');
      
      // Create payment intent
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      console.log('✅ Payment intent created:', clientSecret);

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      console.log('💳 Confirming payment...');
      console.log('Client Secret:', clientSecret);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
          },
        },
      });

      if (stripeError) {
        console.error('❌ Payment failed:', stripeError);
        setError(stripeError.message || 'Payment failed');
        onError(stripeError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!', paymentIntent);
        
        // Send confirmation email
        console.log('📧 Sending confirmation email...');
        const emailResponse = await fetch('http://localhost:3001/api/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntent: paymentIntent,
            customerEmail: email
          }),
        });

        if (emailResponse.ok) {
          console.log('✅ Email sent successfully');
        } else {
          console.error('❌ Email sending failed');
        }

        onSuccess(paymentIntent);
      }
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      setError(err.message || 'Something went wrong');
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Stripe...</p>
        <p className="text-xs text-muted-foreground mt-2">
          Stripe: {stripe ? '✅' : '❌'} | Elements: {elements ? '✅' : '❌'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <Label>Card Details *</Label>
        <div className="p-4 border rounded-lg bg-white min-h-[50px]">
          <CardElement 
            options={cardElementOptions}
            onReady={() => {
              console.log('✅ CardElement ready');
              setCardElementReady(true);
            }}
            onChange={(event) => console.log('CardElement changed:', event)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Card Element Status: {cardElementReady ? '✅ Ready' : '⏳ Loading...'}
          {!cardElementReady && ' - If this stays loading, check browser console for errors'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !cardElementReady}
        className="w-full h-12 text-lg"
        style={{ backgroundColor: '#fd9f48' }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Security Message */}
      <div className="flex items-center text-xs text-muted-foreground">
        <Lock className="h-4 w-4 mr-2" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
};

// Main checkout component
const SimpleStripeCheckout = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError,
  initialEmail = ''
}: { 
  totalAmount?: number; 
  onPaymentSuccess?: (paymentIntent: any) => void; 
  onPaymentError?: (error: any) => void; 
  initialEmail?: string;
}) => {
  const [amount] = useState(totalAmount || 25.99);

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('🎉 Payment successful!', paymentIntent);
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentIntent);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Payment error:', error);
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6 mr-2" />
            Payment Details
          </CardTitle>
          <div className="text-center text-2xl font-bold" style={{ color: '#fd9f48' }}>
            ${amount.toFixed(2)}
          </div>
        </CardHeader>
        <CardContent>
          <PaymentForm 
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            initialEmail={initialEmail}
          />
          
          {/* Test Card Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Test Card Numbers:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Visa:</strong> 4242 4242 4242 4242</p>
              <p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
              <p><strong>Amex:</strong> 3782 822463 10005</p>
              <p className="text-xs mt-2">Use any future expiry date and any 3-digit CVC</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Elements>
  );
};

export default SimpleStripeCheckout;
