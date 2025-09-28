import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/services/realEmailService';
import { useToast } from '@/hooks/use-toast';

const EmailTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testOrder = {
    id: 'test-123',
    orderNumber: 'TB-123456-789',
    orderDate: new Date().toISOString(),
    items: [
      {
        id: 1,
        name: 'Premium Dog Food',
        price: 29.99,
        quantity: 2,
        image: '🐕'
      },
      {
        id: 2,
        name: 'Cat Litter',
        price: 15.99,
        quantity: 1,
        image: '🐱'
      }
    ],
    subtotal: 75.97,
    shipping: 0,
    tax: 6.08,
    total: 82.05,
    status: 'pending' as const,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Pet Street',
      city: 'Pet City',
      state: 'PC',
      zipCode: '12345',
      country: 'United States',
      phone: '(555) 123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Pet Street',
      city: 'Pet City',
      state: 'PC',
      zipCode: '12345',
      country: 'United States'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '1234'
    }
  };

  const testEmailData = {
    order: testOrder,
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com'
  };

  const testConfirmationEmail = async () => {
    setIsLoading(true);
    try {
      const result = await sendOrderConfirmationEmail(testEmailData);
      if (result) {
        toast({
          title: "Test Email Sent!",
          description: "Order confirmation email sent successfully. Check your email!",
        });
      } else {
        toast({
          title: "Email Failed",
          description: "Failed to send confirmation email. Check console for errors.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Error",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotificationEmail = async () => {
    setIsLoading(true);
    try {
      const result = await sendOrderNotificationEmail(testEmailData);
      if (result) {
        toast({
          title: "Test Email Sent!",
          description: "Admin notification email sent successfully. Check totosbureau@gmail.com!",
        });
      } else {
        toast({
          title: "Email Failed",
          description: "Failed to send notification email. Check console for errors.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Error",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50 shadow-strong">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">📧 Email Test Page</CardTitle>
            <p className="text-center text-muted-foreground">
              Test the email functionality before using it in the cart
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Test Order Details:</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p><strong>Order #:</strong> {testOrder.orderNumber}</p>
                <p><strong>Customer:</strong> {testEmailData.customerName}</p>
                <p><strong>Email:</strong> {testEmailData.customerEmail}</p>
                <p><strong>Total:</strong> ${testOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Test Email Sending:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={testConfirmationEmail}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal to-forest hover:from-teal/90 hover:to-forest/90 text-white"
                >
                  {isLoading ? 'Sending...' : 'Test Customer Email'}
                </Button>
                
                <Button 
                  onClick={testNotificationEmail}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-forest to-teal hover:from-forest/90 hover:to-teal/90 text-white"
                >
                  {isLoading ? 'Sending...' : 'Test Admin Email'}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure you've created the email templates in EmailJS dashboard</li>
                <li>• Template IDs must be: "order_confirmation" and "order_notification"</li>
                <li>• Check browser console for any error messages</li>
                <li>• Customer email will be sent to: john.doe@example.com</li>
                <li>• Admin email will be sent to: totosbureau@gmail.com</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTest;
