// Vercel serverless function for sending emails via Nodemailer
// Works from any domain - no restrictions like EmailJS
const nodemailer = require('nodemailer');
const security = require('./utils/security');

// SECURITY FIX: HTML sanitization to prevent XSS in email templates
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
  // SECURITY FIX: Apply security middleware
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
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Validate required fields
    const { to, subject, html, text } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Toto's Bureau" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''),
      replyTo: 'totosbureau@gmail.com',
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

