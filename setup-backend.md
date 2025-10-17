# Backend Setup for Email & Stripe Integration

## Prerequisites
1. **Stripe Secret Key**: Get your secret key from Stripe Dashboard
2. **Gmail App Password**: For sending emails

## Step 1: Get Stripe Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_`)
3. Replace `sk_test_YOUR_SECRET_KEY_HERE` in `server.js`

## Step 2: Setup Gmail for Emails
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Replace in `server.js`:
   - `your-email@gmail.com` with your Gmail address
   - `your-app-password` with the generated app password

## Step 3: Install Backend Dependencies
```bash
# Copy the server package.json
cp server-package.json package.json

# Install dependencies
npm install

# Install nodemon globally (optional)
npm install -g nodemon
```

## Step 4: Run the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

## Step 5: Update Frontend to Use Backend
The frontend is already configured to call the backend APIs at `/api/*`

## Testing
1. Backend runs on: http://localhost:3001
2. Frontend runs on: http://localhost:8080
3. Test payments will now send real emails!

## Environment Variables (Optional)
Create a `.env` file:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

Then update `server.js` to use:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```
