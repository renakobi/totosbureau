const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple working server is running' });
});

// Mock payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('Creating payment intent for:', req.body);
    const { amount, currency = 'usd' } = req.body;
    
    const mockPaymentIntent = {
      id: 'pi_test_' + Date.now(),
      client_secret: 'pi_test_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9),
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method'
    };

    console.log('Payment intent created:', mockPaymentIntent.id);
    res.json({ clientSecret: mockPaymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Email endpoint that works
app.post('/api/payment-success', async (req, res) => {
  try {
    const { paymentIntent, customerEmail } = req.body;
    
    console.log('🎉 PAYMENT SUCCESS!');
    console.log('📧 Customer Email:', customerEmail);
    console.log('💰 Amount: $' + (paymentIntent.amount / 100).toFixed(2));
    console.log('🆔 Payment ID:', paymentIntent.id);
    
    // Create email content
    const emailContent = `
🎉 PAYMENT CONFIRMATION - TOTO'S BUREAU
========================================

Dear Valued Customer,

Thank you for your purchase! Your payment has been processed successfully.

PAYMENT DETAILS:
• Amount: $${(paymentIntent.amount / 100).toFixed(2)}
• Payment ID: ${paymentIntent.id}
• Status: ${paymentIntent.status}
• Date: ${new Date().toLocaleDateString()}

WHAT'S NEXT:
Your order is being processed and will be shipped soon!
You'll receive tracking information once your order ships.

If you have any questions, please contact us at:
📧 Email: support@totosbureau.com
📞 Phone: 1-800-TOTO-BUREAU

Best regards,
Toto's Bureau Team
Premium Pet Care & Supplies
========================================
    `;

    // Log the email content
    console.log('\n📧 EMAIL CONTENT FOR CUSTOMER:');
    console.log('========================================');
    console.log(emailContent);
    console.log('========================================\n');
    
    console.log('✅ Email content generated successfully!');
    console.log('💡 In production, this would be sent via email service');
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      emailSent: true,
      paymentId: paymentIntent.id,
      customerEmail: customerEmail,
      emailContent: emailContent,
      note: 'Email content logged. In production, integrate with SendGrid, Mailgun, or AWS SES for real email delivery.'
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SIMPLE WORKING SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Payment Intent: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`   - Payment Success: http://localhost:${PORT}/api/payment-success`);
  console.log(`\n💡 This server processes payments and logs email content`);
  console.log(`💡 For production, integrate with a real email service`);
});
