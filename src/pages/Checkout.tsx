import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
// import StripePayment from '@/components/StripePayment';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Debug logging
  console.log('Checkout page loaded, cartItems:', cartItems);

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentSuccess(true);
    setShowPayment(false);
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
      navigate('/orders');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl">🐾</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            {!showPayment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Choose your preferred payment method to complete your order.
                  </p>
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="w-full"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPayment(false)}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Payment Options
                </Button>
                
                {paymentError && (
                  <Alert variant="destructive">
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Payment Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Demo Payment
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      This is a demonstration checkout. No real payment will be processed.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800">
                        <strong>Demo Mode:</strong> Click the button below to simulate a successful payment.
                      </AlertDescription>
                    </Alert>
                    
                    <Button
                      onClick={() => {
                        // Simulate payment processing
                        const paymentIntent = {
                          id: `pi_demo_${Date.now()}`,
                          amount: finalTotal * 100,
                          currency: 'usd',
                          status: 'succeeded',
                          payment_method: 'demo_card',
                        };
                        handlePaymentSuccess(paymentIntent);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      size="lg"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ${finalTotal.toFixed(2)} (Demo)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
