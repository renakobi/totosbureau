import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RealStripePayment from '@/components/RealStripePayment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield, Zap } from 'lucide-react';

const StripeTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-amber-50/15">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#fd9f48' }}>
              Stripe Payment Testing
            </h1>
            <p className="text-lg text-muted-foreground">
              Test your Stripe integration with our secure payment system
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fd9f48' }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PCI-compliant payment processing with industry-standard security
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9aedb6' }}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Instant payment processing with real-time confirmation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fd9f48' }}>
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple integration with comprehensive documentation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Test Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Test Card Numbers:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 4242 4242 4242 4242 (Visa)</li>
                    <li>• 4000 0566 5566 5556 (Visa Debit)</li>
                    <li>• 5555 5555 5555 4444 (Mastercard)</li>
                    <li>• 3782 822463 10005 (American Express)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Test Details:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use any future date for expiry</li>
                    <li>• Use any 3 digits for CVC</li>
                    <li>• Use any valid email address</li>
                    <li>• No real money will be charged</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real Payment Component */}
          <RealStripePayment />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StripeTest;
