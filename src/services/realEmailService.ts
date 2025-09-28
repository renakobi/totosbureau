import emailjs from '@emailjs/browser';
import { Order } from '@/contexts/OrderContext';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_7jxiqbn';
const EMAILJS_PUBLIC_KEY = 'wrnxwtK4twdnvBS9g';

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

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // For EmailJS, we need to send the data in a specific format
    const templateParams = {
      to_email: emailData.to,
      subject: emailData.subject,
      message: emailData.html,
      from_name: 'Toto\'s Bureau',
      reply_to: 'totosbureau@gmail.com'
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

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

  const templateParams = {
    email: customerEmail,
    to_name: customerName,
    customer_name: customerName,
    order_number: order.orderNumber,
    order_date: orderDate,
    order_status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    items_list: itemsList,
    subtotal: order.subtotal.toFixed(2),
    shipping: order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`,
    tax: order.tax.toFixed(2),
    total: order.total.toFixed(2),
    shipping_address: `${order.shippingAddress.name}\n${order.shippingAddress.street}\n${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n${order.shippingAddress.country}`,
    estimated_delivery: estimatedDelivery,
    from_name: 'Toto\'s Bureau',
    reply_to: 'totosbureau@gmail.com'
  };

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'order_confirmation', // Different template for order confirmation
      templateParams
    );

    // Email sent successfully
    return true;
  } catch (error) {
    console.error('Order confirmation email failed:', error);
    return false;
  }
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

  const templateParams = {
    email: 'totosbureau@gmail.com',
    to_name: 'Toto\'s Bureau Admin',
    customer_name: customerName,
    customer_email: customerEmail,
    order_number: order.orderNumber,
    order_date: orderDate,
    order_status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    items_list: itemsList,
    subtotal: order.subtotal.toFixed(2),
    shipping: order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`,
    tax: order.tax.toFixed(2),
    total: order.total.toFixed(2),
    shipping_address: `${order.shippingAddress.name}\n${order.shippingAddress.street}\n${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n${order.shippingAddress.country}`,
    customer_phone: order.shippingAddress.phone,
    from_name: 'Toto\'s Bureau Website',
    reply_to: customerEmail
  };

  try {
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'order_notification', // Different template for admin notification
      templateParams
    );

    // Email sent successfully
    return true;
  } catch (error) {
    console.error('Order notification email failed:', error);
    return false;
  }
};
