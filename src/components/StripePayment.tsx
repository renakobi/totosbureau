import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key');

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isDemoMode = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_demo_key' || !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Demo mode - simulate payment
    if (isDemoMode) {
      setTimeout(() => {
        const paymentIntent = {
          id: `pi_demo_${Date.now()}`,
          amount: amount * 100,
          currency: 'usd',
          status: 'succeeded',
          payment_method: 'demo_card',
        };
        onSuccess(paymentIntent);
        setIsProcessing(false);
      }, 2000);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError(stripeError.message || 'Payment failed');
        return;
      }

      // In a real app, you would send the payment method to your backend
      // For now, we'll simulate a successful payment
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        status: 'succeeded',
        payment_method: paymentMethod?.id,
      };

      onSuccess(paymentIntent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isDemoMode && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            <strong>Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed. 
            In production, you would need to set up Stripe API keys.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Card Information
        </label>
        <div className="p-3 border border-border rounded-md bg-background">
          {isDemoMode ? (
            <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded">
              <CreditCard className="w-8 h-8 mx-auto mb-2" />
              <p>Demo Payment Form</p>
              <p className="text-sm">No real card required</p>
            </div>
          ) : (
            <CardElement
              options={{
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
              }}
            />
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Pay ${amount.toFixed(2)}
          </div>
        )}
      </Button>
    </form>
  );
};

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Secure Payment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your payment information is secure and encrypted
          </p>
        </CardHeader>
        <CardContent>
          <PaymentForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </CardContent>
      </Card>
    </Elements>
  );
};

export default StripePayment;
