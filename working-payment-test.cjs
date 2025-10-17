const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Email configuration for testing - Using console logging instead of real email
const transporter = {
  sendMail: async (mailOptions) => {
    console.log('📧 EMAIL WOULD BE SENT:');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from);
    console.log('HTML Content:', mailOptions.html);
    console.log('📧 Email sent successfully (simulated)');
    return { messageId: 'simulated-' + Date.now() };
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Mock payment intent endpoint (for testing without real Stripe)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('Creating mock payment intent for:', req.body);
    const { amount, currency = 'usd' } = req.body;
    
    // Mock payment intent response
    const mockPaymentIntent = {
      id: 'pi_test_' + Date.now(),
      client_secret: 'pi_test_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9),
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method'
    };

    console.log('Mock payment intent created:', mockPaymentIntent.id);
    res.json({ clientSecret: mockPaymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment success endpoint
app.post('/api/payment-success', async (req, res) => {
  try {
    const { paymentIntent, customerEmail } = req.body;
    
    console.log('🎉 PAYMENT SUCCESS!');
    console.log('📧 Sending email to:', customerEmail);
    console.log('💰 Amount: $' + (paymentIntent.amount / 100).toFixed(2));
    console.log('🆔 Payment ID:', paymentIntent.id);
    
    // Send actual email
    try {
      const mailOptions = {
        from: 'Toto\'s Bureau <totosbureau@gmail.com>',
        to: customerEmail,
        subject: '🎉 Payment Confirmation - Toto\'s Bureau',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fd9f48; font-size: 28px; margin: 0;">🎉 Payment Successful!</h1>
              <p style="color: #666; font-size: 16px; margin: 10px 0;">Thank you for your purchase at Toto's Bureau!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentIntent.id}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${paymentIntent.status}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 16px;">Your order is being processed and will be shipped soon!</p>
              <p style="color: #666; font-size: 14px;">You'll receive tracking information once your order ships.</p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Best regards,<br>
                <strong style="color: #fd9f48;">Toto's Bureau Team</strong><br>
                Premium Pet Care & Supplies
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', customerEmail);
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
      console.log('📧 Email content (for manual sending):');
      console.log(`
      ========================================
      🎉 PAYMENT CONFIRMATION - TOTO'S BUREAU
      ========================================
      
      Dear Customer,
      
      Thank you for your purchase! Your payment has been processed successfully.
      
      Payment Details:
      • Amount: $${(paymentIntent.amount / 100).toFixed(2)}
      • Payment ID: ${paymentIntent.id}
      • Status: ${paymentIntent.status}
      
      Your order is being processed and will be shipped soon!
      
      Best regards,
      Toto's Bureau Team
      ========================================
      `);
    }
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      emailSent: true,
      paymentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MOCK PAYMENT SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Payment Intent: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`   - Payment Success: http://localhost:${PORT}/api/payment-success`);
  console.log(`\n💡 This is a MOCK server for testing. No real payments will be processed.`);
  console.log(`💡 To use real Stripe, replace with your actual secret key.`);
});
