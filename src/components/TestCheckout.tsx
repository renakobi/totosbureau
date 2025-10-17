import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TestCheckout = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setResult('Testing backend...');
    
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:3001/api/health');
      const healthData = await healthResponse.json();
      setResult(prev => prev + '\nHealth: ' + JSON.stringify(healthData));
      
      // Test payment intent creation
      const paymentResponse = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 25.99,
          currency: 'usd'
        }),
      });
      
      const paymentData = await paymentResponse.json();
      setResult(prev => prev + '\nPayment Intent: ' + JSON.stringify(paymentData));
      
      // Test email sending
      const emailResponse = await fetch('http://localhost:3001/api/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntent: {
            id: 'pi_test_123456789',
            amount: 2599,
            status: 'succeeded'
          },
          customerEmail: email || 'renakobeissi2004@gmail.com'
        }),
      });
      
      const emailData = await emailResponse.json();
      setResult(prev => prev + '\nEmail: ' + JSON.stringify(emailData));
      
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        
        <Button 
          onClick={testBackend}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        {result && (
          <Alert>
            <AlertDescription>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{result}</pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TestCheckout;
