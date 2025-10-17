# Quick Gmail Setup for Toto's Bureau

## Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Find "2-Step Verification" and turn it ON
4. Follow the setup process

## Step 2: Generate App Password
1. In the same Security section, find "App passwords"
2. Click "App passwords"
3. Select "Mail" as the app
4. Click "Generate"
5. Copy the 16-character password (like: abcd efgh ijkl mnop)

## Step 3: Update Server
1. Open `working-email-server.cjs`
2. Find line 13: `pass: 'your-app-password-here'`
3. Replace with your actual app password: `pass: 'abcd efgh ijkl mnop'`
4. Save the file

## Step 4: Restart Server
```bash
node working-email-server.cjs
```

## Step 5: Test
1. Go to: http://localhost:8080/stripe-test
2. Enter your email and amount
3. Click "Test Payment"
4. Check your email inbox!

## That's it! 🎉
Your customers will now receive real confirmation emails.
