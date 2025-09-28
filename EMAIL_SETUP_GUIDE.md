# 📧 Email Setup Guide for Toto's Bureau

## Option 1: EmailJS (Recommended - No Backend Required)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Important**: Use `totosbureau@gmail.com` as the email address
6. Copy the **Service ID** (you'll need this)

### Step 3: Create Email Templates
1. Go to "Email Templates" in your dashboard
2. Create two templates:

#### Template 1: Order Confirmation (Template ID: `order_confirmation`)
**Subject**: Order Confirmation - {{order_number}} - Toto's Bureau

**Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation - Toto's Bureau</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🐾 Toto's Bureau</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Premium Pet Care & Supplies</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-bottom: 20px;">Order Confirmation</h2>
            <p>Hi {{customer_name}},</p>
            <p>Thank you for your order! We're excited to help you care for your furry friends. Your order has been confirmed and is being prepared.</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Order #{{order_number}}</h3>
                <p style="margin: 8px 0; color: #6b7280;">Placed on {{order_date}}</p>
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">{{order_status}}</span>
            </div>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Order Items</h3>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">{{items_list}}</pre>
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span>Subtotal</span>
                    <span>${{subtotal}}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span>Shipping</span>
                    <span>{{shipping}}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span>Tax</span>
                    <span>${{tax}}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 16px 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
                    <span>Total</span>
                    <span>${{total}}</span>
                </div>
            </div>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Shipping Information</h3>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">{{shipping_address}}</pre>
                <p style="margin: 16px 0 8px 0; color: #6b7280;">
                    <strong>Estimated Delivery:</strong> {{estimated_delivery}}
                </p>
            </div>
            
            <p>We'll send you another email when your order ships. If you have any questions, feel free to contact us at totosbureau@gmail.com.</p>
            
            <p>Thanks for choosing Toto's Bureau!</p>
            <p><strong>The Toto's Bureau Team</strong></p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
            <p>© 2024 Toto's Bureau. All rights reserved.</p>
            <p>This email was sent to {{to_email}}</p>
        </div>
    </div>
</body>
</html>
```

#### Template 2: Order Notification (Template ID: `order_notification`)
**Subject**: New Order #{{order_number}} - {{customer_name}} - ${{total}}

**Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order Notification - Toto's Bureau</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🐾 New Order Received</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Toto's Bureau Admin Notification</p>
        </div>
        
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-bottom: 16px;">Order #{{order_number}}</h2>
            <p><strong>Order Date:</strong> {{order_date}}</p>
            <p><strong>Status:</strong> {{order_status}}</p>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <h3 style="margin-top: 0; color: #111827;">Customer Information</h3>
                <p><strong>Name:</strong> {{customer_name}}</p>
                <p><strong>Email:</strong> {{customer_email}}</p>
                <p><strong>Phone:</strong> {{customer_phone}}</p>
            </div>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <h3 style="margin-top: 0; color: #111827;">Order Items</h3>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">{{items_list}}</pre>
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
                <p><strong>Subtotal:</strong> ${{subtotal}}</p>
                <p><strong>Shipping:</strong> {{shipping}}</p>
                <p><strong>Tax:</strong> ${{tax}}</p>
                <p><strong>Total:</strong> ${{total}}</p>
            </div>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0;">
                <h3 style="margin-top: 0; color: #111827;">Shipping Address</h3>
                <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">{{shipping_address}}</pre>
            </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
            <p>This is an automated notification from Toto's Bureau</p>
        </div>
    </div>
</body>
</html>
```

### Step 4: Get Your Public Key
1. Go to "Account" in your EmailJS dashboard
2. Copy your **Public Key**

### Step 5: Update the Code
1. Open `src/services/realEmailService.ts`
2. Replace the placeholder values:
   ```typescript
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your actual service ID
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your actual template ID
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your actual public key
   ```

### Step 6: Test the Integration
1. Start your development server: `npm run dev`
2. Place a test order
3. Check your email for the confirmation
4. Check `totosbureau@gmail.com` for the admin notification

## Option 2: Backend Email Service (Advanced)

If you prefer a backend solution, you can use:
- **SendGrid** (recommended)
- **AWS SES**
- **Nodemailer with SMTP**

This would require creating a backend API endpoint to handle email sending.

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your domain is added to EmailJS allowed origins
2. **Template not found**: Double-check template IDs match exactly
3. **Service not found**: Verify service ID is correct
4. **Rate limiting**: Free EmailJS accounts have limits

### Testing:
- Use the EmailJS dashboard to test templates
- Check browser console for error messages
- Verify all template variables are properly formatted

## Free Tier Limits (EmailJS):
- 200 emails per month
- 2 email services
- 2 email templates
- Perfect for testing and small projects

For production use with higher volume, consider upgrading to a paid plan or implementing a backend solution.
