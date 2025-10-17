# 🏦 Stripe Setup Guide - How to Receive Real Money

## Current Status: ✅ Test Mode Working
Your Stripe integration is working perfectly in test mode. Now let's set it up to receive real money.

## Step 1: Complete Stripe Account Setup

1. **Go to**: https://dashboard.stripe.com
2. **Log in** with your Stripe account
3. **Complete required information**:
   - Business information
   - Identity verification
   - Bank account details
   - Tax information (W-9 for US)

## Step 2: Add Bank Account for Payouts

1. **In Stripe Dashboard** → **Settings** → **Payouts**
2. **Click "Add bank account"**
3. **Enter your bank details**:
   - Bank name
   - Account number
   - Routing number
   - Account holder name

## Step 3: Get Live API Keys

1. **In Stripe Dashboard** → **Toggle "Test mode" OFF**
2. **Go to**: **Developers** → **API keys**
3. **Copy your live keys**:
   - **Publishable key**: `pk_live_...` (replace in code)
   - **Secret key**: `sk_live_...` (replace in backend)

## Step 4: Update Your Code

### Frontend (src/lib/stripe.ts):
```typescript
// Replace this line:
const stripePublishableKey = 'pk_test_51SHrFb2NGWfNNG3Ew7nstxKwavxmLHdTJN1d9PZPeJeqtENqvw5GSflqLM5nW3O3WQMJKpkiZVeR5nJ3bxgtAHP800jUcTLtCN';

// With your live key:
const stripePublishableKey = 'pk_live_YOUR_LIVE_PUBLISHABLE_KEY_HERE';
```

### Backend (working-email-server.cjs):
```javascript
// Replace this line:
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// With your live key:
const stripe = require('stripe')('sk_live_YOUR_LIVE_SECRET_KEY_HERE');
```

## Step 5: Test with Small Amount

1. **Update both keys** (frontend and backend)
2. **Restart your backend server**
3. **Test with a small amount** (like $1.00)
4. **Check Stripe Dashboard** → **Payments** to see the transaction

## Step 6: Payout Schedule

- **Default**: Stripe pays out every 2 business days
- **Minimum payout**: $1.00
- **Fees**: 2.9% + 30¢ per transaction
- **You can change payout schedule** in Settings → Payouts

## Important Notes

⚠️ **Security**: Never commit live keys to version control
⚠️ **Testing**: Always test with small amounts first
⚠️ **Compliance**: Make sure you're following payment regulations in your country

## Current Test Mode Status

✅ **Frontend**: Working (card input fields appear)
✅ **Backend**: Working (payment intents created)
✅ **Email**: Working (confirmation emails sent)
✅ **Integration**: Complete end-to-end flow

## Next Steps

1. Complete Stripe account setup
2. Add bank account
3. Get live API keys
4. Update code with live keys
5. Test with small amount
6. Start accepting real payments!

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Your Dashboard**: https://dashboard.stripe.com
