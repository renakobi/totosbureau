# 🔧 Stripe Email Setup Guide

## Current Status
- ✅ Stripe payments work
- ❌ Email confirmations are mocked (only console logs)
- ❌ No real email service configured

## 🚀 Quick Setup (Choose One)

### Option 1: SendGrid (Recommended - Free Tier Available)

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Create free account (100 emails/day free)

2. **Get API Key**
   - Go to Settings > API Keys
   - Create new API key
   - Copy the key (starts with `SG.`)

3. **Set Environment Variable**
   ```bash
   # Windows
   set SENDGRID_API_KEY=your-api-key-here
   
   # Mac/Linux
   export SENDGRID_API_KEY=your-api-key-here
   ```

4. **Install Dependencies**
   ```bash
   npm install --prefix . @sendgrid/mail
   ```

5. **Start SendGrid Server**
   ```bash
   node sendgrid-server.cjs
   ```

6. **Verify Sender Domain** (Important!)
   - In SendGrid dashboard, go to Settings > Sender Authentication
   - Add and verify your domain (e.g., `totosbureau.com`)
   - Or use a verified single sender email

### Option 2: Gmail SMTP (Quick Setup)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"

3. **Update Server** (I can help with this)

### Option 3: Mailgun (Alternative)

1. **Sign up at https://mailgun.com**
2. **Get API credentials**
3. **Update server configuration**

## 🧪 Test Your Setup

1. **Start the SendGrid server:**
   ```bash
   node sendgrid-server.cjs
   ```

2. **Test payment:**
   - Go to http://localhost:8080/stripe-test
   - Enter any email address
   - Complete test payment
   - Check if email arrives!

## 🔍 Troubleshooting

### If emails don't arrive:
1. **Check spam folder**
2. **Verify SendGrid API key is correct**
3. **Check SendGrid dashboard for delivery logs**
4. **Ensure sender email is verified in SendGrid**

### If SendGrid fails:
- Server will log email content to console as fallback
- Check console output for email content

## 📧 Email Template Features

- ✅ Professional HTML design
- ✅ Toto's Bureau branding
- ✅ Payment details
- ✅ Order confirmation
- ✅ Contact information

## 🎯 Next Steps

1. Choose an email service (SendGrid recommended)
2. Set up API key
3. Start the SendGrid server
4. Test with real email address
5. Verify emails arrive in inbox

Need help with any step? Let me know!
