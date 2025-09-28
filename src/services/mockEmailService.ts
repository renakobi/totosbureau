import { Order } from '@/contexts/OrderContext';

export interface OrderEmailData {
  order: Order;
  customerName: string;
  customerEmail: string;
}

// Mock email service that shows emails in console and browser
export const sendOrderConfirmationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
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

  const itemsList = order.items.map(item => 
    `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  // Create email content
  const emailContent = `
📧 ORDER CONFIRMATION EMAIL
============================

To: ${customerEmail}
From: Toto's Bureau <totosbureau@gmail.com>
Subject: Order Confirmation - ${order.orderNumber} - Toto's Bureau

Hi ${customerName},

Thank you for your order! We're excited to help you care for your furry friends. 
Your order has been confirmed and is being prepared.

Order #${order.orderNumber}
Placed on: ${orderDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Order Items:
${itemsList}

Order Summary:
Subtotal: $${order.subtotal.toFixed(2)}
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

We'll send you another email when your order ships. If you have any questions, 
feel free to contact us at totosbureau@gmail.com.

Thanks for choosing Toto's Bureau!
The Toto's Bureau Team

© 2024 Toto's Bureau. All rights reserved.
  `;

  // Log to console
  console.log('📧 CUSTOMER CONFIRMATION EMAIL SENT:');
  console.log(emailContent);
  
  // Show in browser alert (for testing)
  if (window.confirm('📧 Email sent! Check console for details. Click OK to see email content.')) {
    alert(emailContent);
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

export const sendOrderNotificationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  const { order, customerName, customerEmail } = orderData;
  
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsList = order.items.map(item => 
    `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  // Create email content
  const emailContent = `
📧 ADMIN NOTIFICATION EMAIL
============================

To: totosbureau@gmail.com
From: Toto's Bureau Website
Subject: New Order #${order.orderNumber} - ${customerName} - $${order.total.toFixed(2)}

NEW ORDER RECEIVED!

Order #${order.orderNumber}
Order Date: ${orderDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

Customer Information:
Name: ${customerName}
Email: ${customerEmail}
Phone: ${order.shippingAddress.phone}

Order Items:
${itemsList}

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

  // Log to console
  console.log('📧 ADMIN NOTIFICATION EMAIL SENT:');
  console.log(emailContent);
  
  // Show in browser alert (for testing)
  if (window.confirm('📧 Admin notification sent! Check console for details. Click OK to see email content.')) {
    alert(emailContent);
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};
