# SendGrid Setup for Toto's Bureau

## Step 1: Create SendGrid Account
1. Go to https://sendgrid.com
2. Click "Start for Free"
3. Sign up with your email
4. Verify your email address

## Step 2: Get API Key
1. Log into SendGrid dashboard
2. Go to Settings > API Keys
3. Click "Create API Key"
4. Choose "Restricted Access"
5. Give it a name like "Toto's Bureau"
6. Set permissions to "Mail Send" > "Full Access"
7. Click "Create & View"
8. Copy the API key (starts with SG.)

## Step 3: Update Server
Replace `your-sendgrid-api-key-here` in `sendgrid-server.cjs` with your actual API key:

```javascript
sgMail.setApiKey('SG.your-actual-api-key-here');
```

## Step 4: Test
1. Start the server: `node sendgrid-server.cjs`
2. Test at: http://localhost:8080/stripe-test
3. Check your email inbox!

## Free Tier Limits
- 100 emails per day
- Perfect for testing and small businesses
- Upgrade as you grow

## That's it! 🎉
Your customers will now receive real confirmation emails.
