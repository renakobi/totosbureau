import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { stripePromise } from '@/lib/stripe';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, XCircle, Shield, Lock } from 'lucide-react';

// Card brand logos component
const CardBrandLogos = () => (
  <div className="flex items-center justify-center space-x-3 mb-4">
    <div className="text-xs text-muted-foreground">We accept:</div>
    <div className="flex space-x-2">
      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">VISA</span>
      </div>
      <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">MC</span>
      </div>
      <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">AMEX</span>
      </div>
      <div className="w-8 h-5 bg-purple-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">DISC</span>
      </div>
    </div>
  </div>
);

// Real payment form component
const PaymentForm = ({ amount, onSuccess, onError }: { 
  amount: number; 
  onSuccess: (paymentIntent: any) => void; 
  onError: (error: any) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');
  const [email, setEmail] = useState('');

  // Debug logging
  console.log('PaymentForm rendered:', { stripe: !!stripe, elements: !!elements, amount });
  
  // Add a visible indicator that the component is loaded
  if (!stripe || !elements) {
    console.log('⚠️ Stripe Elements not ready yet...');
    console.log('Stripe object:', stripe);
    console.log('Elements object:', elements);
  } else {
    console.log('✅ Stripe Elements are ready!');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('🚀 Payment form submitted!', { stripe: !!stripe, elements: !!elements, email, amount: totalAmount || amount });

    if (!stripe || !elements) {
      console.log('❌ Stripe or Elements not loaded');
      return;
    }

    setIsLoading(true);
    setStatus('processing');
    console.log('🔄 Starting payment process...');

    try {
      // Create payment intent with real Stripe
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount || amount,
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      console.log('✅ Payment intent created:', clientSecret);

      // Confirm payment with real Stripe
      console.log('🔄 Confirming payment with Stripe...');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
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
          const emailData = await emailResponse.json();
          console.log('✅ Email sent successfully:', emailData);
        } else {
          const errorData = await emailResponse.json();
          console.error('❌ Email sending failed:', errorData);
        }

        setStatus('succeeded');
        console.log('🎉 Calling onSuccess callback...');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-base"
        />
      </div>

      {/* Card Brand Logos */}
      <CardBrandLogos />

      {/* Stripe Payment Element */}
      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="p-4 border rounded-lg bg-background">
          <PaymentElement 
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: {
                  email: 'never'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isLoading || !email}
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
            Pay ${(totalAmount || amount).toFixed(2)}
          </>
        )}
      </Button>

      {/* Status Messages */}
      {status === 'succeeded' && (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Payment successful! Check your email for confirmation.
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

// Main real Stripe payment component
const RealStripePayment = ({ 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError 
}: { 
  totalAmount?: number; 
  onPaymentSuccess?: (paymentIntent: any) => void; 
  onPaymentError?: (error: any) => void; 
} = {}) => {
  const [amount, setAmount] = useState(totalAmount || 29.99);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Debug logging
  console.log('RealStripePayment component rendered!', { 
    totalAmount, 
    amount, 
    showPayment, 
    paymentResult 
  });


  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentResult({ success: true, paymentIntent });
    setShowPayment(false);
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentIntent);
    }
  };

  const handlePaymentError = (error: any) => {
    setPaymentResult({ success: false, error });
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  if (paymentResult?.success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600 flex items-center justify-center text-xl">
            <CheckCircle className="h-6 w-6 mr-2" />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment of ${(totalAmount || amount).toFixed(2)} has been processed successfully.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-mono">
              Payment ID: {paymentResult.paymentIntent.id}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Status: {paymentResult.paymentIntent.status}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address.
          </p>
          <Button 
            onClick={() => {
              setPaymentResult(null);
              setShowPayment(false);
            }}
            variant="outline"
            className="w-full"
          >
            Make Another Payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!showPayment) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {totalAmount ? 'Complete Payment' : 'Real Stripe Payment'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!totalAmount && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.50"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="text-lg"
              />
            </div>
          )}
          
          {totalAmount && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold" style={{ color: '#fd9f48' }}>
                ${totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          )}
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">Test Card Numbers:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-mono">4242 4242 4242 4242</span>
                <span className="text-amber-600 ml-2">(Visa)</span>
              </div>
              <div>
                <span className="font-mono">5555 5555 5555 4444</span>
                <span className="text-amber-600 ml-2">(Mastercard)</span>
              </div>
              <div>
                <span className="font-mono">3782 822463 10005</span>
                <span className="text-amber-600 ml-2">(Amex)</span>
              </div>
              <div>
                <span className="font-mono">4000 0566 5566 5556</span>
                <span className="text-amber-600 ml-2">(Visa Debit)</span>
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-2">
              Use any future expiry date and any 3-digit CVC
            </p>
          </div>
          
          <Button 
            onClick={() => {
              console.log('🚀 Pay button clicked!', { totalAmount, amount });
              setShowPayment(true);
            }}
            className="w-full h-12 text-lg"
            style={{ backgroundColor: '#fd9f48' }}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {totalAmount ? `Pay $${totalAmount.toFixed(2)}` : 'Start Payment'}
          </Button>
          
          
          <div className="text-xs text-muted-foreground text-center">
            🔒 Secure payment processing by Stripe
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl">Complete Payment</CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            Amount: ${(totalAmount || amount).toFixed(2)}
          </div>
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

export default RealStripePayment;
