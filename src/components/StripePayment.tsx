import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { stripePromise, createPaymentIntent, handlePayment } from '@/lib/stripe';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

// Payment form component
const PaymentForm = ({ amount, onSuccess, onError }: { 
  amount: number; 
  onSuccess: (paymentIntent: any) => void; 
  onError: (error: any) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setStatus('processing');

    try {
      // Get email from form
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const email = emailInput?.value || 'test@example.com';

      // Create payment intent
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // For mock testing, simulate payment confirmation
      // In production, you would use: stripe.confirmPayment({ elements, clientSecret, ... })
      const mockPaymentIntent = {
        id: 'pi_test_' + Date.now(),
        status: 'succeeded',
        amount: amount * 100,
        currency: 'usd'
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use mock payment intent for testing
      const paymentIntent = mockPaymentIntent;

      if (paymentIntent.status === 'succeeded') {
        // Send confirmation email
        const emailResponse = await fetch('http://localhost:3001/api/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntent,
            customerEmail: email
          }),
        });

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          console.log('Email sent:', emailData);
        }

        setStatus('succeeded');
        onSuccess(paymentIntent);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('failed');
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details</Label>
        <div className="p-4 border rounded-md bg-muted/30 space-y-3">
          <div className="text-sm font-medium text-foreground mb-2">Test Card Information:</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="card-number" className="text-xs">Card Number</Label>
              <Input 
                id="card-number"
                name="card-number"
                placeholder="4242 4242 4242 4242"
                className="text-sm"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="card-expiry" className="text-xs">Expiry</Label>
              <Input 
                id="card-expiry"
                name="card-expiry"
                placeholder="12/25"
                className="text-sm"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="card-cvc" className="text-xs">CVC</Label>
              <Input 
                id="card-cvc"
                name="card-cvc"
                placeholder="123"
                className="text-sm"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="card-name" className="text-xs">Name on Card</Label>
              <Input 
                id="card-name"
                name="card-name"
                placeholder="John Doe"
                className="text-sm"
                readOnly
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            💡 This is a test environment. The form will auto-fill with test data.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="test@example.com"
          autoComplete="email"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        style={{ backgroundColor: '#fd9f48' }}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      {status === 'succeeded' && (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Payment successful!
        </div>
      )}

      {status === 'failed' && (
        <div className="flex items-center text-red-600 text-sm">
          <XCircle className="h-4 w-4 mr-2" />
          Payment failed. Please try again.
        </div>
      )}
    </form>
  );
};

// Main Stripe payment component
const StripePayment = () => {
  const [amount, setAmount] = useState(29.99);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentResult({ success: true, paymentIntent });
    setShowPayment(false);
  };

  const handlePaymentError = (error: any) => {
    setPaymentResult({ success: false, error });
  };

  if (paymentResult?.success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 mr-2" />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment of ${amount.toFixed(2)} has been processed successfully.
          </p>
          <p className="text-sm text-muted-foreground">
            Payment ID: {paymentResult.paymentIntent.id}
          </p>
          <Button 
            onClick={() => {
              setPaymentResult(null);
              setShowPayment(false);
            }}
            variant="outline"
          >
            Make Another Payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!showPayment) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Test Stripe Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.50"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <Button 
            onClick={() => setShowPayment(true)}
            className="w-full"
            style={{ backgroundColor: '#fd9f48' }}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Test Payment
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            This is a test environment. No real money will be charged.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Complete Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm 
            amount={amount} 
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </CardContent>
      </Card>
    </Elements>
  );
};

export default StripePayment;