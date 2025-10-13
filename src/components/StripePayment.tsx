import React, { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { stripePromise, createPaymentIntent, confirmPayment, sendPaymentConfirmationEmail } from '@/services/stripeService';

interface PaymentFormProps {
  amount: number;
  customerEmail: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, customerEmail, orderItems, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const secret = await createPaymentIntent(amount);
        setClientSecret(secret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        onError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Send confirmation email
        try {
          await sendPaymentConfirmationEmail({
            customerEmail,
            amount,
            orderId: paymentIntent.id,
            items: orderItems,
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the payment if email fails
        }

        onSuccess(paymentIntent);
      } else {
        setError('Payment was not successful');
        onError('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-center text-muted-foreground">Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Payment Information
        </label>
        <div className="p-3 border border-border rounded-md bg-background">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full bg-primary hover:bg-primary/90 text-white"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
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
  customerEmail: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, customerEmail, orderItems, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
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
          <PaymentForm 
            amount={amount} 
            customerEmail={customerEmail}
            orderItems={orderItems}
            onSuccess={onSuccess} 
            onError={onError} 
          />
        </CardContent>
      </Card>
    </Elements>
  );
};

export default StripePayment;
