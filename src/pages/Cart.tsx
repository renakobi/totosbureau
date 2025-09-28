import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutReview from "@/components/CheckoutReview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "@/services/realEmailService";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [showCheckoutReview, setShowCheckoutReview] = useState(false);
  const { toast } = useToast();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("totos-bureau-user") === "true" || localStorage.getItem("totos-bureau-admin") === "true";
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to your account to proceed with checkout.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setShowCheckoutReview(true);
  };

  const handleProceedToPayment = async () => {
    // Prevent multiple submissions
    if (isCheckingOut) {
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const subtotal = getTotalPrice();
      const shipping = subtotal > 50 ? 0 : 9.99;
      
      // Create order from cart items
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const tax = subtotal * 0.08; // 8% tax
      const finalTotal = subtotal + shipping + tax;

      // Use current user data if available, otherwise use mock data
      const customerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "John Doe";
      const customerEmail = currentUser ? currentUser.email : "customer@example.com";
      const customerPhone = currentUser ? currentUser.phone : "(555) 123-4567";
      const customerAddress = currentUser ? currentUser.address : {
        street: "123 Pet Street",
        city: "Pet City",
        state: "PC",
        zipCode: "12345",
        country: "United States"
      };

      const newOrder = addOrder({
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total: finalTotal,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        shippingAddress: {
          name: customerName,
          street: customerAddress.street,
          city: customerAddress.city,
          state: customerAddress.state,
          zipCode: customerAddress.zipCode,
          country: customerAddress.country,
          phone: customerPhone
        },
        billingAddress: {
          name: customerName,
          street: customerAddress.street,
          city: customerAddress.city,
          state: customerAddress.state,
          zipCode: customerAddress.zipCode,
          country: customerAddress.country
        },
        paymentMethod: {
          type: "Credit Card",
          last4: "1234"
        }
      });

      // Send email notifications
      const orderEmailData = {
        order: newOrder,
        customerName,
        customerEmail
      };

      // Send order confirmation to customer
      const confirmationSent = await sendOrderConfirmationEmail(orderEmailData);

      // Send order notification to admin
      const notificationSent = await sendOrderNotificationEmail(orderEmailData);

      if (confirmationSent && notificationSent) {
        toast({
          title: "Order Confirmed!",
          description: "Your order has been placed and confirmation emails have been sent.",
        });
      } else {
        toast({
          title: "Order Confirmed",
          description: "Your order has been placed successfully. (Some email notifications may have failed)",
          variant: "destructive"
        });
      }

      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      setCheckoutComplete(true);
      setShowCheckoutReview(false);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${newOrder.orderNumber} has been confirmed. You will receive a confirmation email shortly.`,
      });
    } catch (error) {
      console.error('Order processing failed:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Always reset loading state
      setIsCheckingOut(false);
    }
  };

  const handleEditCart = () => {
    setShowCheckoutReview(false);
  };

  const handleEditShipping = () => {
    // In a real app, this would open a shipping form
    toast({
      title: "Edit Shipping",
      description: "Shipping form would open here.",
    });
  };

  const handleEditBilling = () => {
    // In a real app, this would open a billing form
    toast({
      title: "Edit Billing",
      description: "Billing form would open here.",
    });
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeFromCart(id);
    toast({
      title: "Item Removed",
      description: `${name} has been removed from your cart.`,
    });
  };

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-12">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h1>
                <p className="text-lg text-muted-foreground">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button size="lg">Continue Shopping</Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="lg">View Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showCheckoutReview) {
    // Double-check authentication before showing checkout review
    const isLoggedIn = localStorage.getItem("totos-bureau-user") === "true" || localStorage.getItem("totos-bureau-admin") === "true";
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to your account to proceed with checkout.",
        variant: "destructive"
      });
      navigate("/login");
      return null;
    }

    return (
      <div className="min-h-screen bg-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <CheckoutReview
            onProceedToPayment={handleProceedToPayment}
            onEditCart={handleEditCart}
            onEditShipping={handleEditShipping}
            onEditBilling={handleEditBilling}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back to Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <ShoppingBag className="h-8 w-8 mr-3 text-primary" />
              Shopping Cart ({cartItems.length} items)
            </h1>

            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Link to="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.name}</h3>
                          <p className="text-lg font-bold text-primary">${item.price}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-sm text-primary">🎉 Free shipping on orders over $50!</p>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6" 
                    size="lg" 
                    onClick={handleProceedToCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Secure checkout with SSL encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;