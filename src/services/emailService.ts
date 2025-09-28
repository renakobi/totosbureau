import { Order } from '@/contexts/OrderContext';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface OrderEmailData {
  order: Order;
  customerName: string;
  customerEmail: string;
}

// Mock email service - in a real app, this would integrate with an email service like SendGrid, AWS SES, etc.
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, this would make an actual API call to your email service
    console.log('📧 Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    });
    
    // For demo purposes, we'll always return true
    // In production, you'd handle actual success/failure responses
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const generateOrderConfirmationEmail = (orderData: OrderEmailData): EmailData => {
  const { order, customerName, customerEmail } = orderData;
  
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const estimatedDelivery = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            ${item.image}
          </div>
          <div>
            <div style="font-weight: 600; color: #111827;">${item.name}</div>
            <div style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Toto's Bureau</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 32px; text-align: center; }
        .content { padding: 32px; }
        .order-summary { background: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .order-details { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .total-section { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; }
        .status-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🐾 Toto's Bureau</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Premium Pet Care & Supplies</p>
        </div>
        
        <div class="content">
          <h2 style="color: #111827; margin-bottom: 16px;">Order Confirmation</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! We're excited to help you care for your furry friends. Your order has been confirmed and is being prepared.</p>
          
          <div class="order-summary">
            <h3 style="margin-top: 0; color: #111827;">Order #${order.orderNumber}</h3>
            <p style="margin: 8px 0; color: #6b7280;">Placed on ${orderDate}</p>
            <span class="status-badge">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #111827;">Order Items</h3>
            <table>
              ${itemsHtml}
            </table>
          </div>
          
          <div class="total-section">
            <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Subtotal (${order.items.length} items)</span>
              <span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Shipping</span>
              <span>${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Tax</span>
              <span>$${order.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 16px 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
              <span>Total</span>
              <span>$${order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #111827;">Shipping Information</h3>
            <p style="margin: 8px 0;">
              <strong>${order.shippingAddress.name}</strong><br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              Phone: ${order.shippingAddress.phone}
            </p>
            <p style="margin: 16px 0 8px 0; color: #6b7280;">
              <strong>Estimated Delivery:</strong> ${estimatedDelivery}
            </p>
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="#" class="button">Track Your Order</a>
          </div>
          
          <p>We'll send you another email when your order ships. If you have any questions, feel free to contact us at totosbureau@gmail.com.</p>
          
          <p>Thanks for choosing Toto's Bureau!</p>
          <p><strong>The Toto's Bureau Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2024 Toto's Bureau. All rights reserved.</p>
          <p>This email was sent to ${customerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - Toto's Bureau

Hi ${customerName},

Thank you for your order! Your order has been confirmed and is being prepared.

Order #${order.orderNumber}
Placed on ${orderDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Order Items:
${order.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Order Summary:
Subtotal (${order.items.length} items): $${order.subtotal.toFixed(2)}
Shipping: ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

Shipping Information:
${order.shippingAddress.name}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}
Phone: ${order.shippingAddress.phone}

Estimated Delivery: ${estimatedDelivery}

If you have any questions, contact us at totosbureau@gmail.com.

Thanks for choosing Toto's Bureau!
The Toto's Bureau Team
  `;

  return {
    to: 'totosbureau@gmail.com',
    subject: `New Order #${order.orderNumber} - ${customerName}`,
    html,
    text
  };
};

export const generateOrderNotificationEmail = (orderData: OrderEmailData): EmailData => {
  const { order, customerName, customerEmail } = orderData;
  
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsText = order.items.map(item => 
    `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification - Toto's Bureau</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 24px; text-align: center; }
        .content { padding: 24px; }
        .order-info { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 16px 0; }
        .customer-info { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 16px 0; }
        .items-list { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🐾 New Order Received</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Toto's Bureau Admin Notification</p>
        </div>
        
        <div class="content">
          <h2 style="color: #111827; margin-bottom: 16px;">Order #${order.orderNumber}</h2>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          
          <div class="customer-info">
            <h3 style="margin-top: 0; color: #111827;">Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          </div>
          
          <div class="items-list">
            <h3 style="margin-top: 0; color: #111827;">Order Items</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${itemsText}</pre>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</p>
            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          <div class="customer-info">
            <h3 style="margin-top: 0; color: #111827;">Shipping Address</h3>
            <p>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Toto's Bureau</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Order Notification - Toto's Bureau

Order #${order.orderNumber}
Order Date: ${orderDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Customer Information:
Name: ${customerName}
Email: ${customerEmail}
Phone: ${order.shippingAddress.phone}

Order Items:
${itemsText}

Order Summary:
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

This is an automated notification from Toto's Bureau.
  `;

  return {
    to: 'totosbureau@gmail.com',
    subject: `New Order #${order.orderNumber} - ${customerName} - $${order.total.toFixed(2)}`,
    html,
    text
  };
};
