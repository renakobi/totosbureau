import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, CreditCard, MapPin, User, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CheckoutReviewProps {
  onProceedToPayment: () => void;
  onEditCart: () => void;
  onEditShipping: () => void;
  onEditBilling: () => void;
}

const CheckoutReview: React.FC<CheckoutReviewProps> = ({
  onProceedToPayment,
  onEditCart,
  onEditShipping,
  onEditBilling
}) => {
  const { cartItems, getTotalPrice, getTotalItems, removeFromCart, updateQuantity } = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to your account to proceed with payment.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    onProceedToPayment();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Order Summary Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Review Your Order</h1>
        <p className="text-muted-foreground">Please review your items and details before proceeding to payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Order Items</span>
                <Badge variant="secondary">{getTotalItems()} items</Badge>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onEditCart}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted/30 rounded-lg flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-6 w-6 p-0"
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onEditShipping}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  123 Pet Street<br />
                  Pet City, PC 12345<br />
                  United States
                </p>
                <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Address
              </CardTitle>
              <Button variant="outline" size="sm" onClick={onEditBilling}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">
                  123 Pet Street<br />
                  Pet City, PC 12345<br />
                  United States
                </p>
                <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <Badge variant="secondary">FREE</Badge>
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
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && (
                <div className="text-sm text-muted-foreground">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">•••• •••• •••• 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </CardContent>
          </Card>

          {/* Proceed to Payment */}
          <div className="space-y-4">
            {!isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Login Required</p>
                    <p className="text-sm text-yellow-700">You need to be logged in to complete your purchase.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-teal to-forest hover:from-teal/90 hover:to-forest/90 text-white py-3 text-lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Login to Continue
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-gradient-to-r from-teal to-forest hover:from-teal/90 hover:to-forest/90 text-white py-3 text-lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutReview;
