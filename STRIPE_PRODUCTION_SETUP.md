# 🚀 Stripe Production Setup Guide

This guide will help you set up Stripe payments for production use with real payment processing and email notifications.

## 📋 Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Email Service**: Gmail account for sending confirmation emails
3. **Vercel Account**: For deploying the application

## 🔧 Step 1: Stripe Configuration

### 1.1 Get Your Stripe Keys

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 1.2 Test Mode vs Live Mode

- **Test Mode**: Use test keys for development and testing
- **Live Mode**: Use live keys for production (starts with `pk_live_` and `sk_live_`)

## 📧 Step 2: Email Configuration

### 2.1 Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Navigate to **Security** → **2-Step Verification** → **App passwords**
4. Generate an app password for "Mail"
5. Use this password as `EMAIL_PASS` in your environment variables

## 🌐 Step 3: Vercel Deployment

### 3.1 Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard

### 3.2 Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

## 🧪 Step 4: Testing

### 4.1 Test Payment Flow

1. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`

2. Test the complete flow:
   - Add items to cart
   - Proceed to checkout
   - Enter email address
   - Complete payment
   - Verify email receipt

### 4.2 Test Email Notifications

- Check that confirmation emails are sent
- Verify email content includes order details
- Test with different email addresses

## 🔒 Step 5: Security Considerations

### 5.1 Environment Variables
- Never commit `.env` files to version control
- Use Vercel's environment variable system
- Rotate keys regularly

### 5.2 Webhook Security (Optional)
For production, consider setting up Stripe webhooks for additional security:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🚀 Step 6: Go Live

### 6.1 Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys
3. Update environment variables in Vercel
4. Redeploy your application

### 6.2 Final Testing

1. Test with real (small) amounts
2. Verify all payment methods work
3. Check email delivery
4. Monitor Stripe dashboard for transactions

## 📊 Step 7: Monitoring

### 7.1 Stripe Dashboard
- Monitor payments in real-time
- View transaction history
- Handle disputes and refunds

### 7.2 Application Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track conversion rates

## 🛠 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Check environment variables are set correctly
   - Ensure you're using the right key for test/live mode

2. **Email Not Sending**
   - Verify Gmail app password is correct
   - Check Vercel function logs for errors

3. **Payment Element Not Loading**
   - Ensure `VITE_STRIPE_PUBLISHABLE_KEY` is set
   - Check browser console for errors

4. **CORS Errors**
   - Verify API routes are properly configured in `vercel.json`

### Getting Help

- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)

## 📈 Next Steps

1. **Analytics**: Add payment tracking and analytics
2. **Webhooks**: Implement Stripe webhooks for better reliability
3. **Database**: Store order data in a database
4. **Admin Panel**: Build admin interface for order management
5. **Refunds**: Add refund functionality
6. **Subscriptions**: Implement recurring payments if needed

## ✅ Production Checklist

- [ ] Stripe keys configured (test mode)
- [ ] Email service configured
- [ ] Environment variables set in Vercel
- [ ] Payment flow tested end-to-end
- [ ] Email notifications working
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Monitoring set up
- [ ] Ready to switch to live mode

---

**🎉 Congratulations!** Your Stripe integration is now production-ready with real payment processing and email notifications.


