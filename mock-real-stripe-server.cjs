const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Email configuration using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'renakobeissi2004@gmail.com',
    pass: 'lxle xkgr ahsy nqrh'
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock Real Stripe server is running' });
});

// Create payment intent that simulates real Stripe behavior
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('Creating REAL-LIKE payment intent for:', req.body);
    const { amount, currency = 'usd' } = req.body;
    
    // Generate realistic payment intent data
    const paymentIntentId = 'pi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const clientSecret = paymentIntentId + '_secret_' + Math.random().toString(36).substr(2, 24);
    
    console.log('✅ REAL-LIKE Payment intent created:', paymentIntentId);
    res.json({ 
      clientSecret: clientSecret,
      paymentIntentId: paymentIntentId
    });
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle payment success with realistic data
app.post('/api/payment-success', async (req, res) => {
  try {
    const { paymentIntentId, customerEmail } = req.body;
    
    console.log('🎉 REAL-LIKE PAYMENT SUCCESS!');
    console.log('📧 Customer Email:', customerEmail);
    console.log('🆔 Payment Intent ID:', paymentIntentId);
    
    // Simulate realistic payment data
    const paymentIntent = {
      id: paymentIntentId,
      amount: 2599, // $25.99 in cents
      currency: 'usd',
      status: 'succeeded',
      payment_method_types: ['card'],
      created: Math.floor(Date.now() / 1000)
    };
    
    console.log('💰 Amount: $' + (paymentIntent.amount / 100).toFixed(2));
    console.log('💳 Status:', paymentIntent.status);
    
    // Create beautiful email content
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
• Payment Method: ${paymentIntent.payment_method_types.join(', ').toUpperCase()}

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

    // Send real email
    try {
      const mailOptions = {
        from: 'Toto\'s Bureau <renakobeissi2004@gmail.com>',
        to: customerEmail,
        subject: '🎉 Payment Confirmation - Toto\'s Bureau',
        text: emailContent,
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
                <p style="margin: 8px 0; font-size: 16px;"><strong>Payment Method:</strong> ${paymentIntent.payment_method_types.join(', ').toUpperCase()}</p>
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

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ REAL EMAIL SENT SUCCESSFULLY!');
      console.log('📧 Message ID:', info.messageId);
      console.log('📧 Email sent to:', customerEmail);
      
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
      console.log('\n📧 EMAIL CONTENT FOR CUSTOMER (Manual Send):');
      console.log('========================================');
      console.log(emailContent);
      console.log('========================================\n');
    }
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      emailSent: true,
      paymentId: paymentIntent.id,
      customerEmail: customerEmail,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method_types
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment intent status
app.get('/api/payment-intent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Simulate payment intent retrieval
    const paymentIntent = {
      id: id,
      amount: 2599,
      currency: 'usd',
      status: 'succeeded',
      payment_method_types: ['card'],
      created: Math.floor(Date.now() / 1000)
    };
    res.json(paymentIntent);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MOCK REAL STRIPE SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Payment Intent: http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`   - Payment Success: http://localhost:${PORT}/api/payment-success`);
  console.log(`   - Payment Status: http://localhost:${PORT}/api/payment-intent/:id`);
  console.log(`\n💳 REAL-LIKE STRIPE INTEGRATION ACTIVE`);
  console.log(`📧 Email service: Gmail Nodemailer`);
  console.log(`🎉 Ready for realistic payments!`);
});
