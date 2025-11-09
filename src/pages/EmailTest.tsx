import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/services/emailService';
import { sendEmail } from '@/services/emailService';
import emailjs from '@emailjs/browser';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  // Check EmailJS configuration
  const checkConfig = () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    const customerTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || '';
    const ownerTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER || '';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    // Also log all environment variables that start with VITE_EMAILJS for debugging
    console.log('🔍 All EmailJS env vars:', {
      VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      VITE_EMAILJS_TEMPLATE_ID_CUSTOMER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER,
      VITE_EMAILJS_TEMPLATE_ID_OWNER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER,
      VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 'SET (hidden)' : 'NOT SET',
      // Check import.meta.env keys
      allEnvKeys: Object.keys(import.meta.env).filter(key => key.includes('EMAILJS') || key.includes('emailjs'))
    });

    const status = {
      serviceId: { value: serviceId, configured: !!serviceId, raw: import.meta.env.VITE_EMAILJS_SERVICE_ID },
      customerTemplate: { value: customerTemplate, configured: !!customerTemplate, raw: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER },
      ownerTemplate: { value: ownerTemplate, configured: !!ownerTemplate, raw: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER },
      publicKey: { value: publicKey ? `${publicKey.substring(0, 10)}...` : '', configured: !!publicKey, raw: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET' },
    };

    setConfigStatus(status);
    console.log('📧 EmailJS Configuration:', status);
    
    return status;
  };

  // Test direct EmailJS send
  const testDirectEmailJS = async () => {
    setLoading(true);
    setResults({});
    
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || '';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

      console.log('🔍 EmailJS Config Check:', {
        serviceId: serviceId ? '✅ SET' : '❌ MISSING',
        templateId: templateId ? '✅ SET' : '❌ MISSING',
        publicKey: publicKey ? `✅ SET (${publicKey.length} chars)` : '❌ MISSING',
        publicKeyPreview: publicKey ? `${publicKey.substring(0, 10)}...` : 'NOT SET'
      });

      if (!serviceId || !templateId || !publicKey) {
        setResults({
          error: 'EmailJS not configured!',
          details: { 
            serviceId: serviceId || 'MISSING', 
            templateId: templateId || 'MISSING', 
            publicKey: publicKey ? `SET (${publicKey.length} chars)` : 'MISSING',
            help: 'Make sure all three values are in your .env file and you restarted the server'
          }
        });
        setLoading(false);
        return;
      }

      // Initialize EmailJS with the public key
      try {
        emailjs.init(publicKey);
        console.log('✅ EmailJS initialized with public key');
      } catch (initError) {
        console.error('❌ Failed to initialize EmailJS:', initError);
        setResults({
          error: 'Failed to initialize EmailJS',
          details: { initError: String(initError) }
        });
        setLoading(false);
        return;
      }

      const recipientEmail = testEmail || 'test@example.com';
      const testParams = {
        // PRIMARY: email (matches your template {{email}})
        email: recipientEmail, // This is what your template expects!
        
        // Also send alternatives
        to_email: recipientEmail,
        user_email: recipientEmail,
        recipient_email: recipientEmail,
        
        // Recipient name
        to_name: 'Test User',
        user_name: 'Test User',
        name: 'Test User',
        
        // Subject
        subject: `Test Email - ${new Date().toLocaleString()}`,
        
        // Message content - try multiple variable names
        message_html: '<h1>Test Email</h1><p>This is a test email from Toto\'s Bureau EmailJS integration.</p>',
        message: '<h1>Test Email</h1><p>This is a test email from Toto\'s Bureau EmailJS integration.</p>',
        html: '<h1>Test Email</h1><p>This is a test email from Toto\'s Bureau EmailJS integration.</p>',
        
        // Plain text
        message_text: 'Test Email - This is a test email from Toto\'s Bureau EmailJS integration.',
        text: 'Test Email - This is a test email from Toto\'s Bureau EmailJS integration.',
        
        // Reply to
        reply_to: 'totosbureau@gmail.com',
      };
      
      console.log('📧 Template parameters being sent:', {
        recipientEmail,
        templateId,
        hasRecipient: !!recipientEmail,
        paramKeys: Object.keys(testParams)
      });

      console.log('📧 Sending test email via EmailJS...', { 
        serviceId, 
        templateId, 
        to: testParams.to_email,
        publicKeyConfigured: !!publicKey,
        publicKeyLength: publicKey?.length || 0
      });

      const response = await emailjs.send(serviceId, templateId, testParams);
      
      setResults({
        success: true,
        response,
        message: 'Email sent successfully!',
      });
      console.log('✅ EmailJS Response:', response);
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message || 'Unknown error',
        details: {
          status: error.status,
          text: error.text,
          message: error.message,
        }
      });
      console.error('❌ EmailJS Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test using email service wrapper
  const testEmailService = async () => {
    setLoading(true);
    setResults({});
    
    try {
      const emailData = {
        to: testEmail || 'test@example.com',
        subject: `Test Email via Service - ${new Date().toLocaleString()}`,
        html: '<h1>Test Email</h1><p>This is a test email using the email service wrapper.</p>',
        text: 'Test Email - This is a test email using the email service wrapper.',
      };

      console.log('📧 Testing email service wrapper...', emailData);

      const success = await sendEmail(emailData);
      
      setResults({
        success,
        message: success ? 'Email service returned success!' : 'Email service returned failure',
      });
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message || 'Unknown error',
      });
      console.error('❌ Email Service Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test order emails
  const testOrderEmails = async () => {
    setLoading(true);
    setResults({});
    
    try {
      // Create mock order data
      const mockOrder = {
        id: 'test-order-123',
        orderNumber: 'TB-TEST-001',
        items: [
          { id: 1, name: 'Test Product', price: 29.99, quantity: 2, image: '🐾' }
        ],
        subtotal: 59.98,
        shipping: 9.99,
        tax: 4.80,
        total: 74.77,
        status: 'pending' as const,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: {
          name: 'Test Customer',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'United States',
          phone: '(555) 123-4567'
        },
        billingAddress: {
          name: 'Test Customer',
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'United States'
        },
        paymentMethod: {
          type: 'Credit Card',
          last4: '1234'
        }
      };

      const customerEmail = testEmail || 'test@example.com';
      
      console.log('📧 Testing order confirmation email...');
      const confirmationResult = await sendOrderConfirmationEmail({
        order: mockOrder,
        customerName: 'Test Customer',
        customerEmail
      });

      console.log('📧 Testing order notification email...');
      const notificationResult = await sendOrderNotificationEmail({
        order: mockOrder,
        customerName: 'Test Customer',
        customerEmail
      });

      setResults({
        success: confirmationResult && notificationResult,
        confirmation: confirmationResult,
        notification: notificationResult,
        message: 'Order emails test completed!',
      });
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message || 'Unknown error',
      });
      console.error('❌ Order Email Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>📧 EmailJS Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Check */}
          <div>
            <Button onClick={checkConfig} variant="outline" className="mb-4">
              Check EmailJS Configuration
            </Button>
            {configStatus && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">Configuration Status:</h3>
                <div className="space-y-1 text-sm">
                  <div>Service ID: {configStatus.serviceId.configured ? '✅' : '❌'} {configStatus.serviceId.configured ? 'Configured' : 'Missing'}</div>
                  <div>Customer Template: {configStatus.customerTemplate.configured ? '✅' : '❌'} {configStatus.customerTemplate.configured ? 'Configured' : 'Missing'}</div>
                  <div>Owner Template: {configStatus.ownerTemplate.configured ? '✅' : '❌'} {configStatus.ownerTemplate.configured ? 'Configured' : 'Missing'}</div>
                  <div>Public Key: {configStatus.publicKey.configured ? '✅' : '❌'} {configStatus.publicKey.configured ? 'Configured' : 'Missing'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Test Email Input */}
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              name="testEmail"
              type="email"
              placeholder="your-email@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Leave empty to use default test@example.com
            </p>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={testDirectEmailJS}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Sending...' : 'Test Direct EmailJS'}
            </Button>
            <Button
              onClick={testEmailService}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Sending...' : 'Test Email Service'}
            </Button>
            <Button
              onClick={testOrderEmails}
              disabled={loading}
              variant="secondary"
            >
              {loading ? 'Sending...' : 'Test Order Emails'}
            </Button>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <Alert variant={results.success ? 'default' : 'destructive'}>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click "Check EmailJS Configuration" to verify your .env variables are loaded</li>
              <li>Enter a test email address (or leave default)</li>
              <li>Click "Test Direct EmailJS" to test the EmailJS connection directly</li>
              <li>Check the browser console (F12) for detailed logs</li>
              <li>Check your email inbox for the test email</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTest;

