const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Real email configuration using Ethereal (test email service)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'ethereal.user@ethereal.email',
    pass: 'ethereal.pass'
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real email server is running' });
});

// Mock payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('Creating payment intent for:', req.body);
    const { amount, currency = 'usd' } = req.body;
    
    // Mock payment intent response
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

// Real email sending endpoint
app.post('/api/payment-success', async (req, res) => {
  try {
    const { paymentIntent, customerEmail } = req.body;
    
    console.log('🎉 PAYMENT SUCCESS!');
    console.log('📧 Sending REAL email to:', customerEmail);
    console.log('💰 Amount: $' + (paymentIntent.amount / 100).toFixed(2));
    console.log('🆔 Payment ID:', paymentIntent.id);
    
    // Create beautiful email
    const mailOptions = {
      from: 'Toto\'s Bureau <noreply@totosbureau.com>',
      to: customerEmail,
      subject: '🎉 Payment Confirmation - Toto\'s Bureau',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="text-align: center; margin-bottom: 30px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #fd9f48; font-size: 32px; margin: 0; font-weight: bold;">🎉 Payment Successful!</h1>
            <p style="color: #666; font-size: 18px; margin: 15px 0;">Thank you for your purchase at Toto's Bureau!</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0; font-size: 20px;">Payment Details:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 8px 0; font-size: 16px;"><strong>Amount:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Payment ID:</strong> ${paymentIntent.id}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${paymentIntent.status}</span></p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <p style="color: #666; font-size: 16px; margin: 10px 0;">Your order is being processed and will be shipped soon!</p>
            <p style="color: #666; font-size: 14px; margin: 10px 0;">You'll receive tracking information once your order ships.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong style="color: #fd9f48; font-size: 16px;">Toto's Bureau Team</strong><br>
              <span style="color: #666;">Premium Pet Care & Supplies</span>
            </p>
          </div>
        </div>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ REAL EMAIL SENT!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    res.json({ 
      success: true, 
      message: 'Payment processed and email sent successfully',
      emailSent: true,
      paymentId: paymentIntent.id,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 REAL EMAIL SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Payment Intent: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`   - Payment Success: http://localhost:${PORT}/api/payment-success`);
  console.log(`\n💡 This server sends REAL emails using Ethereal test service`);
  console.log(`💡 Check the console for email preview URLs`);
});
