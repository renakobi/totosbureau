// Vercel serverless function for sending emails via Nodemailer
// Works from any domain - no restrictions like EmailJS
import nodemailer from 'nodemailer';
import * as security from './utils/security.js';

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

export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    security.handleCORS(req, res, () => {
      return res.status(200).end();
    });
    return;
  }

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
    // Log request for debugging
    console.log('📧 Email API called:', {
      method: req.method,
      hasBody: !!req.body,
      envCheck: {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        vercelEnv: process.env.VERCEL_ENV
      }
    });

    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email service not configured:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        emailUser: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'NOT SET'
      });
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'EMAIL_USER and EMAIL_PASS environment variables must be set in Vercel',
        debug: {
          hasEmailUser: !!process.env.EMAIL_USER,
          hasEmailPass: !!process.env.EMAIL_PASS
        }
      });
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
    const info = await transporter.sendMail({
      from: `"Toto's Bureau" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''),
      replyTo: 'totosbureau@gmail.com',
    });

    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: info.messageId,
      response: info.response
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ Email send error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message || 'Unknown error',
      code: error.code,
      debug: process.env.VERCEL_ENV === 'development' ? {
        stack: error.stack,
        response: error.response
      } : undefined
    });
  }
}

