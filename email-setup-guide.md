# Email Setup Guide for Toto's Bureau

## Current Status
The payment system is working, but emails are not being sent due to Gmail authentication issues.

## Option 1: Fix Gmail Authentication (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Turn on 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account → Security
2. 2-Step Verification → App passwords
3. Select "Mail" as the app
4. Generate a 16-character password

### Step 3: Update Server Configuration
In `working-payment-test.cjs`, replace:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-actual-email@gmail.com', // Your Gmail address
    pass: 'your-16-character-app-password' // The generated app password
  }
});
```

## Option 2: Use a Different Email Service

### Using Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
});
```

### Using SendGrid (Professional)
1. Sign up at sendgrid.com
2. Get API key
3. Use SMTP configuration

## Option 3: Test Without Real Emails (Current Setup)
The current setup logs all email content to the console, so you can see exactly what would be sent.

## Testing
After setting up email:
1. Restart the server: `node working-payment-test.cjs`
2. Test payment at: `http://localhost:8080/stripe-test`
3. Check console for email logs or your inbox for real emails
