import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Mail, Package, ArrowLeft, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Get order details from location state or localStorage
    const orderData = location.state?.orderDetails || JSON.parse(localStorage.getItem('lastOrder') || '{}');
    setOrderDetails(orderData);
    
    // Check if email was sent
    if (orderData.paymentIntent?.id) {
      setEmailSent(true);
    }
  }, [location.state]);

  if (!orderDetails || !orderDetails.paymentIntent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-amber-50/15">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Order Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We couldn't find your order details. Please check your email or contact support.
              </p>
              <Button onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-amber-50/15">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#fd9f48' }}>
              Order Confirmed!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase at Toto's Bureau
            </p>
            <p className="text-sm text-muted-foreground">
              Order #{orderDetails.paymentIntent.id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Email Status */}
          {emailSent && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                <strong>Confirmation email sent!</strong> Check your inbox for order details and tracking information.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${orderDetails.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${orderDetails.shipping?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${orderDetails.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span style={{ color: '#fd9f48' }}>
                      ${orderDetails.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p className="text-lg font-semibold">
                      {orderDetails.paymentMethod === 'cash_on_delivery' 
                        ? 'Cash on Delivery' 
                        : 'Card Payment'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                    <p className="font-mono text-sm">{orderDetails.paymentIntent.id}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {orderDetails.paymentMethod === 'cash_on_delivery' 
                        ? 'Pending Payment' 
                        : orderDetails.paymentIntent.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p>{formatDate(orderDetails.date || new Date().toISOString())}</p>
                  </div>

                  {orderDetails.shippingInfo && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Shipping Address</label>
                      <p className="text-sm">
                        {orderDetails.shippingInfo.street}
                        {orderDetails.shippingInfo.apartment && `, ${orderDetails.shippingInfo.apartment}`}
                        <br />
                        {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.postalCode}
                        <br />
                        {orderDetails.shippingInfo.email}
                        <br />
                        {orderDetails.shippingInfo.phone}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your order for shipment
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Tracking Info</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking details via email
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order will arrive in 3-5 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => navigate('/products')}
              className="flex-1 sm:flex-none"
              style={{ backgroundColor: '#fd9f48' }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
