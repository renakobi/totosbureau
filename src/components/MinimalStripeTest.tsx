import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MinimalStripeTest = () => {
  const [result, setResult] = useState('');

  const testConnection = async () => {
    setResult('Testing...');
    
    try {
      // Test 1: Basic fetch
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      setResult('Health check: ' + JSON.stringify(data));
      
      // Test 2: Payment intent
      const paymentResponse = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 25.99, currency: 'usd' })
      });
      
      const paymentData = await paymentResponse.json();
      setResult(prev => prev + '\nPayment: ' + JSON.stringify(paymentData));
      
      // Test 3: Email
      const emailResponse = await fetch('http://localhost:3001/api/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntent: { id: 'pi_test_123', amount: 2599, status: 'succeeded' },
          customerEmail: 'renakobeissi2004@gmail.com'
        })
      });
      
      const emailData = await emailResponse.json();
      setResult(prev => prev + '\nEmail: ' + JSON.stringify(emailData));
      
    } catch (error: any) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minimal Backend Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testConnection} className="mb-4">
          Test Backend
        </Button>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
          {result || 'Click button to test'}
        </pre>
      </CardContent>
    </Card>
  );
};

export default MinimalStripeTest;
