import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, CreditCard, MapPin, User, Mail, Phone, Lock } from 'lucide-react';
import SimpleStripeCheckout from '@/components/SimpleStripeCheckout';
import TestCheckout from '@/components/TestCheckout';
import MinimalStripeTest from '@/components/MinimalStripeTest';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  // For testing purposes, use mock data if cart is empty
  const testTotal = cartItems.length === 0 ? 25.99 : finalTotal;

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentSuccess(true);
    
    // Prepare order details
    const orderDetails = {
      paymentIntent,
      items: cartItems,
      subtotal: totalPrice,
      shipping: totalPrice > 50 ? 0 : 9.99,
      tax: totalPrice * 0.08,
      total: finalTotal,
      date: new Date().toISOString()
    };
    
    // Store order details for the confirmation page
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Clear cart and redirect to confirmation page
    clearCart();
    navigate('/order-confirmation', { 
      state: { orderDetails } 
    });
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };


  // For testing purposes, show payment form even with empty cart
  // if (cartItems.length === 0 && !paymentSuccess) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="text-center">
  //         <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
  //         <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
  //         <p className="text-muted-foreground mb-6">Add some products to get started!</p>
  //         <Button onClick={() => navigate('/products')}>
  //           Continue Shopping
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

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
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cart')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}

              {/* Test Mode Notice */}
              {cartItems.length === 0 && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>Test Mode:</strong> Cart is empty, using test amount of ${testTotal.toFixed(2)} for payment testing.
                  </AlertDescription>
                </Alert>
              )}

              <MinimalStripeTest />
              
              <div className="mt-4">
                <SimpleStripeCheckout 
                  totalAmount={testTotal}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(error) => setPaymentError(error.message)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{item.quantity}</Badge>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No items in cart.</p>
                )}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
