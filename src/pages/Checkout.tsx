import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { useOrders } from '@/contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, CreditCard, MapPin, Mail, Phone, Truck, Wallet } from 'lucide-react';
import SimpleStripeCheckout from '@/components/SimpleStripeCheckout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/services/emailService';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  postalCode: string;
}

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useUser();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<ShippingInfo>>({});

  // Auto-fill form if user is logged in (but NOT for admin accounts)
  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) {
      setShippingInfo({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        street: currentUser.address?.street || '',
        apartment: '',
        city: currentUser.address?.city || '',
        postalCode: currentUser.address?.zipCode || ''
      });
    }
  }, [currentUser]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const validateForm = (): boolean => {
    const errors: Partial<ShippingInfo> = {};
    
    if (!shippingInfo.firstName || shippingInfo.firstName.trim().length < 2) {
      errors.firstName = 'Please enter your first name';
    }
    
    if (!shippingInfo.lastName || shippingInfo.lastName.trim().length < 2) {
      errors.lastName = 'Please enter your last name';
    }
    
    if (!shippingInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!shippingInfo.phone || shippingInfo.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!shippingInfo.street || shippingInfo.street.trim().length < 5) {
      errors.street = 'Please enter a valid street address';
    }
    
    if (!shippingInfo.city || shippingInfo.city.trim().length < 2) {
      errors.city = 'Please enter a valid city';
    }
    
    if (!shippingInfo.postalCode || !/^\d{5}(-\d{4})?$/.test(shippingInfo.postalCode)) {
      errors.postalCode = 'Please enter a valid postal code (e.g., 12345 or 12345-6789)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);

    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '🐾'
      }));

      // Create order in OrderContext
      const customerName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
      const fullStreetAddress = shippingInfo.apartment 
        ? `${shippingInfo.street}, ${shippingInfo.apartment}`
        : shippingInfo.street;

      const newOrder = addOrder({
        items: orderItems,
        subtotal: totalPrice,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: {
          name: customerName,
          street: fullStreetAddress,
          city: shippingInfo.city,
          state: shippingInfo.postalCode.split('-')[0] || 'N/A', // Using postal code area as state
          zipCode: shippingInfo.postalCode,
          country: 'United States',
          phone: shippingInfo.phone
        },
        billingAddress: {
          name: customerName,
          street: fullStreetAddress,
          city: shippingInfo.city,
          state: shippingInfo.postalCode.split('-')[0] || 'N/A',
          zipCode: shippingInfo.postalCode,
          country: 'United States'
        },
        paymentMethod: {
          type: 'Cash on Delivery',
          last4: 'CASH'
        }
      });

      // Prepare order details for confirmation page
      const orderDetails = {
        paymentIntent: {
          id: newOrder.id,
          status: 'pending',
          payment_method: 'cash_on_delivery'
        },
        items: cartItems,
        shippingInfo: {
          ...shippingInfo,
          name: customerName
        },
        subtotal: totalPrice,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        date: newOrder.orderDate,
        paymentMethod: 'cash_on_delivery',
        orderNumber: newOrder.orderNumber
      };

      // Store order details
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

      // Send email notifications
      console.log('📧 [Checkout - Cash] Starting to send emails...');
      try {
        const orderEmailData = {
          order: newOrder,
          customerName,
          customerEmail: shippingInfo.email,
          customerFirstName: shippingInfo.firstName,
          customerLastName: shippingInfo.lastName,
          customerPhone: shippingInfo.phone
        };

        console.log('📧 [Checkout - Cash] Order email data prepared:', {
          orderNumber: newOrder.orderNumber,
          customerEmail: shippingInfo.email,
          customerName,
          itemCount: newOrder.items.length
        });

        console.log('📧 [Checkout - Cash] Sending confirmation email...');
        const confirmResult = await sendOrderConfirmationEmail(orderEmailData);
        console.log('📧 [Checkout - Cash] Confirmation email result:', confirmResult);

        console.log('📧 [Checkout - Cash] Sending notification email...');
        const notifyResult = await sendOrderNotificationEmail(orderEmailData);
        console.log('📧 [Checkout - Cash] Notification email result:', notifyResult);
      } catch (emailError) {
        console.error('❌ [Checkout - Cash] Email sending failed:', emailError);
        console.error('❌ [Checkout - Cash] Email error details:', {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        });
        // Don't block order completion if email fails
      }

      // Clear cart and redirect
      clearCart();
      navigate('/order-confirmation', { 
        state: { orderDetails } 
      });

      toast({
        title: "Order Placed!",
        description: "Your cash on delivery order has been placed successfully.",
      });
    } catch (error: any) {
      setPaymentError(error.message || 'Failed to place order');
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Prepare order items
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '🐾'
      }));

      // Create order in OrderContext
      const customerName = `${shippingInfo.firstName} ${shippingInfo.lastName}`;
      const fullStreetAddress = shippingInfo.apartment 
        ? `${shippingInfo.street}, ${shippingInfo.apartment}`
        : shippingInfo.street;

      const newOrder = addOrder({
        items: orderItems,
        subtotal: totalPrice,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: {
          name: customerName,
          street: fullStreetAddress,
          city: shippingInfo.city,
          state: shippingInfo.postalCode.split('-')[0] || 'N/A',
          zipCode: shippingInfo.postalCode,
          country: 'United States',
          phone: shippingInfo.phone
        },
        billingAddress: {
          name: customerName,
          street: fullStreetAddress,
          city: shippingInfo.city,
          state: shippingInfo.postalCode.split('-')[0] || 'N/A',
          zipCode: shippingInfo.postalCode,
          country: 'United States'
        },
        paymentMethod: {
          type: 'Credit Card',
          last4: paymentIntent.payment_method?.card?.last4 || '****'
        }
      });

      // Prepare order details for confirmation page
      const orderDetails = {
        paymentIntent: {
          ...paymentIntent,
          id: newOrder.id
        },
        items: cartItems,
        shippingInfo: {
          ...shippingInfo,
          name: customerName
        },
        subtotal: totalPrice,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        date: newOrder.orderDate,
        paymentMethod: 'card',
        orderNumber: newOrder.orderNumber
      };

      // Store order details
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

      // Send email notifications
      console.log('📧 [Checkout - Card] Starting to send emails...');
      try {
        const orderEmailData = {
          order: newOrder,
          customerName,
          customerEmail: shippingInfo.email,
          customerFirstName: shippingInfo.firstName,
          customerLastName: shippingInfo.lastName,
          customerPhone: shippingInfo.phone
        };

        console.log('📧 [Checkout - Card] Order email data prepared:', {
          orderNumber: newOrder.orderNumber,
          customerEmail: shippingInfo.email,
          customerName,
          itemCount: newOrder.items.length
        });

        console.log('📧 [Checkout - Card] Sending confirmation email...');
        const confirmResult = await sendOrderConfirmationEmail(orderEmailData);
        console.log('📧 [Checkout - Card] Confirmation email result:', confirmResult);

        console.log('📧 [Checkout - Card] Sending notification email...');
        const notifyResult = await sendOrderNotificationEmail(orderEmailData);
        console.log('📧 [Checkout - Card] Notification email result:', notifyResult);
      } catch (emailError) {
        console.error('❌ [Checkout - Card] Email sending failed:', emailError);
        console.error('❌ [Checkout - Card] Email error details:', {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        });
        // Don't block order completion if email fails
      }

      // Clear cart and redirect
      clearCart();
      navigate('/order-confirmation', { 
        state: { orderDetails } 
      });

      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: any) => {
    setPaymentError(error.message || 'Payment failed');
    setShowStripeCheckout(false);
    toast({
      title: "Payment Failed",
      description: error.message || "Payment failed. Please try again.",
      variant: "destructive"
    });
  };

  const handleAddCard = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    setPaymentMethod('card');
    setShowStripeCheckout(true);
    setPaymentError(null);
  };

  if (cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
        <p className="text-muted-foreground mt-2">
          {currentUser ? `Logged in as ${currentUser.email}` : 'Guest Checkout'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Shipping & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={shippingInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={formErrors.firstName ? 'border-destructive' : ''}
                    autoComplete="given-name"
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-destructive">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={shippingInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={formErrors.lastName ? 'border-destructive' : ''}
                    autoComplete="family-name"
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-destructive">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={formErrors.email ? 'border-destructive pl-10' : 'pl-10'}
                      autoComplete="email"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={formErrors.phone ? 'border-destructive pl-10' : 'pl-10'}
                      autoComplete="tel"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-sm text-destructive">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="123 Main Street"
                  value={shippingInfo.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={formErrors.street ? 'border-destructive' : ''}
                  autoComplete="street-address"
                />
                {formErrors.street && (
                  <p className="text-sm text-destructive">{formErrors.street}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apartment">Apartment, Suite, etc. (Optional)</Label>
                <Input
                  id="apartment"
                  name="apartment"
                  type="text"
                  placeholder="Apt 4B"
                  value={shippingInfo.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  autoComplete="address-line2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="New York"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={formErrors.city ? 'border-destructive' : ''}
                    autoComplete="address-level2"
                  />
                  {formErrors.city && (
                    <p className="text-sm text-destructive">{formErrors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    placeholder="12345"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={formErrors.postalCode ? 'border-destructive' : ''}
                    autoComplete="postal-code"
                  />
                  {formErrors.postalCode && (
                    <p className="text-sm text-destructive">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          {!showStripeCheckout && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentError && (
                  <Alert variant="destructive">
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={() => {
                      setPaymentMethod('cash');
                      setPaymentError(null);
                    }}
                  >
                    <Truck className="w-6 h-6" />
                    <span className="font-semibold">Cash on Delivery</span>
                    <span className="text-xs text-muted-foreground">Pay when you receive</span>
                  </Button>

                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={handleAddCard}
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="font-semibold">Add Card</span>
                    <span className="text-xs text-muted-foreground">Secure payment via Stripe</span>
                  </Button>
                </div>

                {paymentMethod === 'cash' && (
                  <Button
                    onClick={handleCashOnDelivery}
                    disabled={isSubmitting}
                    className="w-full"
                    style={{ backgroundColor: '#fd9f48' }}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Truck className="w-5 h-5 mr-2" />
                        Place Order (Cash on Delivery)
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stripe Checkout */}
          {showStripeCheckout && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Card Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <SimpleStripeCheckout 
                  totalAmount={finalTotal}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  initialEmail={shippingInfo.email}
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStripeCheckout(false);
                    setPaymentMethod(null);
                    setPaymentError(null);
                  }}
                  className="w-full mt-4"
                >
                  Back to Payment Options
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 flex-1">
                      <Badge variant="secondary" className="mt-1">{item.quantity}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
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
                    <span style={{ color: '#fd9f48' }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                    Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

