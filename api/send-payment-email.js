
const nodemailer = require('nodemailer');
const security = require('./utils/security');

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = async function handler(req, res) {
  security.handleCORS(req, res, () => {
    security.validateContentType(req, res, () => {
      security.limitRequestSize(1024 * 1024)(req, res, () => {
        security.rateLimit(20, 15 * 60 * 1000)(req, res, () => {
 
            handleRequest(req, res);
        });
      });
    });
  });
};

async function handleRequest(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email service not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    let customerEmail, amount, orderId, items;
    try {
      customerEmail = security.validateInput.email(req.body.customerEmail);
      amount = security.validateInput.amount(req.body.amount);
      orderId = security.validateInput.orderId(req.body.orderId);
      items = security.validateInput.items(req.body.items || []);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const sanitizedOrderId = escapeHtml(orderId);
    const sanitizedAmount = amount.toFixed(2);
    
    const itemsList = items.map(item => {
      const sanitizedName = escapeHtml(item.name);
      const sanitizedPrice = (item.price * item.quantity).toFixed(2);
      return `- ${sanitizedName} x${item.quantity} - $${sanitizedPrice}`;
    }).join('\n');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">Payment Confirmation</h2>
        <p>Thank you for your purchase! Your payment has been processed successfully.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${sanitizedOrderId}</p>
          <p><strong>Total Amount:</strong> $${sanitizedAmount}</p>
          
          <h4>Items:</h4>
          <pre style="white-space: pre-line;">${escapeHtml(itemsList)}</pre>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
        <p>If you have any questions, please contact our support team.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Payment Confirmation - Order ${orderId}`,
      html: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: 'Confirmation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
}
