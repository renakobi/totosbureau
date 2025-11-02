import { Order } from '@/contexts/OrderContext';
import emailjs from '@emailjs/browser';

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
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
}

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || '';
// Support both OWNER and ADMIN variable names for backward compatibility
const EMAILJS_TEMPLATE_ID_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

console.log('📧 EmailJS Config:', {
  serviceId: EMAILJS_SERVICE_ID ? '✅ SET' : '❌ MISSING',
  templateCustomer: EMAILJS_TEMPLATE_ID_CUSTOMER ? `✅ SET (${EMAILJS_TEMPLATE_ID_CUSTOMER})` : '❌ MISSING',
  templateAdmin: EMAILJS_TEMPLATE_ID_ADMIN ? `✅ SET (${EMAILJS_TEMPLATE_ID_ADMIN})` : '⚠️ Using Customer Template',
  publicKey: EMAILJS_PUBLIC_KEY ? `✅ SET (${EMAILJS_PUBLIC_KEY.length} chars)` : '❌ MISSING'
});

// Initialize EmailJS if public key is available
if (EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized');
  } catch (error) {
    console.error('❌ Failed to initialize EmailJS:', error);
  }
}

// Send email using EmailJS
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_CUSTOMER || !EMAILJS_PUBLIC_KEY) {
      console.warn('📧 EmailJS not configured, email would be sent to:', emailData.to);
      console.log('Email content:', {
        subject: emailData.subject,
        html: emailData.html.substring(0, 100) + '...'
      });
      return false;
    }

    // Determine which template to use (customer or admin)
    // Use admin template for totosbureau@gmail.com, customer template otherwise
    const isAdminEmail = emailData.to === 'totosbureau@gmail.com' || emailData.to.includes('totosbureau@gmail.com');
    
    // FORCE admin template for totosbureau emails - throw error if not configured
    let templateId: string;
    if (isAdminEmail) {
      if (!EMAILJS_TEMPLATE_ID_ADMIN) {
        console.error('❌ ADMIN TEMPLATE NOT CONFIGURED! Admin emails will fail.');
        console.error('❌ Set VITE_EMAILJS_TEMPLATE_ID_ADMIN in your .env file');
        // Fall back to customer template but log warning
        templateId = EMAILJS_TEMPLATE_ID_CUSTOMER;
        console.warn('⚠️ Using customer template for admin email - THIS IS WRONG!');
      } else {
        templateId = EMAILJS_TEMPLATE_ID_ADMIN;
      }
    } else {
      templateId = EMAILJS_TEMPLATE_ID_CUSTOMER;
    }
    
    console.log('📧 Template Selection:', {
      recipient: emailData.to,
      isAdmin: isAdminEmail,
      usingTemplate: isAdminEmail ? 'Admin' : 'Customer',
      templateId: templateId,
      adminTemplateConfigured: !!EMAILJS_TEMPLATE_ID_ADMIN
    });

    // Prepare EmailJS template parameters
    // If emailData has order data, extract individual fields for template variables
    const templateParams: Record<string, string> = {
      // Recipient (EmailJS standard variable)
      to_email: emailData.to,
      email: emailData.to,
      user_email: emailData.to,
      recipient_email: emailData.to,
      
      // Subject (EmailJS standard variable)
      subject: emailData.subject,
      
      // HTML content - PRIMARY variable name EmailJS expects
      message: emailData.html,
      // Also send with other common names for compatibility
      message_html: emailData.html,
      html: emailData.html,
      content: emailData.html,
      body_html: emailData.html,
      body: emailData.html,
      
      // Plain text fallback
      message_text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
      body_text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
      
      // Reply to
      reply_to: 'totosbureau@gmail.com',
    };

    // If this email has order data attached (from OrderEmailData), extract individual fields
    // This allows templates to use {{order_number}}, {{customer_name}}, etc.
    if ((emailData as any).orderData) {
      const orderData = (emailData as any).orderData;
      const { order, customerName, customerEmail, customerFirstName, customerLastName, customerPhone } = orderData;
      
      if (order) {
        // Extract order fields for template variables
        templateParams.order_number = order.orderNumber || 'N/A';
        templateParams.order_date = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'N/A';
        templateParams.order_status = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending';
        
        templateParams.customer_name = customerName || 'N/A';
        templateParams.customer_email = customerEmail || 'N/A';
        templateParams.customer_phone = customerPhone || order.shippingAddress?.phone || 'N/A';
        
        // Payment method information
        const paymentType = order.paymentMethod?.type || 'Not specified';
        const paymentLast4 = order.paymentMethod?.last4;
        const isCashOnDelivery = paymentType === 'Cash on Delivery' || paymentType === 'cash_on_delivery';
        
        templateParams.payment_method = paymentType;
        templateParams.payment_status = isCashOnDelivery ? '⚠️ Payment Pending - Cash on Delivery' : '✓ Payment Processed Successfully';
        templateParams.payment_status_icon = isCashOnDelivery ? '⚠️' : '✓';
        templateParams.payment_status_text = isCashOnDelivery ? 'Payment Pending - Cash on Delivery' : 'Payment Processed Successfully';
        templateParams.payment_status_color = isCashOnDelivery ? '#dc2626' : '#059669';
        templateParams.payment_background = isCashOnDelivery ? '#fef2f2' : '#f0fdf4';
        templateParams.card_last4 = paymentLast4 && paymentLast4 !== 'CASH' ? `****${paymentLast4}` : '';
        
        // Order summary
        templateParams.subtotal = `$${(order.subtotal || 0).toFixed(2)}`;
        templateParams.shipping = (order.shipping || 0) === 0 ? 'FREE' : `$${(order.shipping || 0).toFixed(2)}`;
        templateParams.tax = `$${(order.tax || 0).toFixed(2)}`;
        templateParams.total = `$${(order.total || 0).toFixed(2)}`;
        
        // Order items
        templateParams.items_list = order.items?.map(item => 
          `${item.name || 'Unnamed Item'} (Qty: ${item.quantity || 1}) - $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
        ).join('\n') || 'No items';
        
        // Shipping address
        if (order.shippingAddress) {
          templateParams.shipping_address = `${order.shippingAddress.name || 'N/A'}\n${order.shippingAddress.street || 'N/A'}\n${order.shippingAddress.city || 'N/A'}, ${order.shippingAddress.state || 'N/A'} ${order.shippingAddress.zipCode || 'N/A'}\n${order.shippingAddress.country || 'N/A'}`;
        } else {
          templateParams.shipping_address = 'N/A';
        }
      }
    }

    console.log('📧 Sending email via EmailJS:', {
      to: emailData.to,
      subject: emailData.subject,
      serviceId: EMAILJS_SERVICE_ID,
      templateId: templateId,
      isAdmin: emailData.to === 'totosbureau@gmail.com',
      htmlLength: emailData.html.length,
      htmlPreview: emailData.html.substring(0, 200) + '...',
      paramKeys: Object.keys(templateParams)
    });
    
    // Log full HTML for debugging (first 500 chars)
    console.log('📧 HTML Content Preview:', emailData.html.substring(0, 500));

    // Send email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

export const generateOrderConfirmationEmail = (orderData: OrderEmailData): EmailData => {
  console.log('🔍 [generateOrderConfirmationEmail] Input data:', {
    hasOrder: !!orderData.order,
    orderNumber: orderData.order?.orderNumber,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    orderItems: orderData.order?.items?.length || 0,
    fullOrder: orderData.order
  });

  // Validate required data
  if (!orderData.order) {
    console.error('❌ [generateOrderConfirmationEmail] Missing order data!');
    throw new Error('Order data is required');
  }
  
  if (!orderData.customerEmail) {
    console.error('❌ [generateOrderConfirmationEmail] Missing customer email!');
    throw new Error('Customer email is required');
  }

  const { order, customerName = 'Customer', customerEmail } = orderData;
  
  // Safe date parsing with fallbacks
  const orderDateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  const estimatedDeliveryStr = order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  // Validate items exist
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    console.error('❌ [generateOrderConfirmationEmail] No items in order!', order);
    throw new Error('Order must contain items');
  }

  const itemsHtml = order.items.map(item => {
    const itemName = item.name || 'Unnamed Item';
    const itemPrice = item.price || 0;
    const itemQuantity = item.quantity || 1;
    const itemImage = item.image || '🐾';
    
    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            ${itemImage}
          </div>
          <div>
            <div style="font-weight: 600; color: #111827;">${itemName}</div>
            <div style="color: #6b7280; font-size: 14px;">Qty: ${itemQuantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        $${(itemPrice * itemQuantity).toFixed(2)}
      </td>
    </tr>
  `;
  }).join('');

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
          <p>Hi ${customerName || 'Customer'},</p>
          <p>Thank you for your order! We're excited to help you care for your furry friends. Your order has been confirmed and is being prepared.</p>
          
          <div class="order-summary">
            <h3 style="margin-top: 0; color: #111827;">Order #${order.orderNumber || 'N/A'}</h3>
            <p style="margin: 8px 0; color: #6b7280;">Placed on ${orderDateStr}</p>
            <span class="status-badge">${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}</span>
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
              <span>Subtotal (${order.items?.length || 0} items)</span>
              <span>$${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Shipping</span>
              <span>${(order.shipping || 0) === 0 ? 'FREE' : `$${(order.shipping || 0).toFixed(2)}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span>Tax</span>
              <span>$${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 16px 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">
              <span>Total</span>
              <span>$${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #111827;">Payment Method</h3>
            <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #059669;">
              ${order.paymentMethod?.type || 'Not specified'}
              ${order.paymentMethod?.last4 && order.paymentMethod.last4 !== 'CASH' ? ` • ****${order.paymentMethod.last4}` : ''}
            </p>
            ${order.paymentMethod?.type === 'Cash on Delivery' ? '<p style="margin: 8px 0; color: #dc2626; font-weight: 600;">Payment will be collected upon delivery</p>' : '<p style="margin: 8px 0; color: #059669; font-weight: 600;">✓ Payment processed successfully</p>'}
          </div>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #111827;">Shipping Information</h3>
            <p style="margin: 8px 0;">
              <strong>${order.shippingAddress?.name || 'N/A'}</strong><br>
              ${order.shippingAddress?.street || 'N/A'}<br>
              ${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} ${order.shippingAddress?.zipCode || 'N/A'}<br>
              ${order.shippingAddress?.country || 'N/A'}<br>
              Phone: ${order.shippingAddress?.phone || 'N/A'}
            </p>
            <p style="margin: 16px 0 8px 0; color: #6b7280;">
              <strong>Estimated Delivery:</strong> ${estimatedDeliveryStr}
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
          <p>© 2024 Toto's Bureau. ghts reserved.</p>
          <p>This email was sent to ${customerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - Toto's Bureau

Hi ${customerName || 'Customer'},

Thank you for your order! Your order has been confirmed and is being prepared.

Order #${order.orderNumber || 'N/A'}
Placed on ${orderDateStr}
Status: ${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}

Order Items:
${order.items?.map(item => `- ${item.name || 'Unnamed Item'} (Qty: ${item.quantity || 1}) - $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`).join('\n') || 'No items'}

Order Summary:
Subtotal (${order.items?.length || 0} items): $${(order.subtotal || 0).toFixed(2)}
Shipping: ${(order.shipping || 0) === 0 ? 'FREE' : `$${(order.shipping || 0).toFixed(2)}`}
Tax: $${(order.tax || 0).toFixed(2)}
Total: $${(order.total || 0).toFixed(2)}

Payment Method: ${order.paymentMethod?.type || 'Not specified'}${order.paymentMethod?.last4 && order.paymentMethod.last4 !== 'CASH' ? ` (****${order.paymentMethod.last4})` : ''}
${order.paymentMethod?.type === 'Cash on Delivery' ? '⚠️ Payment will be collected upon delivery' : '✓ Payment processed successfully'}

Shipping Information:
${order.shippingAddress?.name || 'N/A'}
${order.shippingAddress?.street || 'N/A'}
${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} ${order.shippingAddress?.zipCode || 'N/A'}
${order.shippingAddress?.country || 'N/A'}
Phone: ${order.shippingAddress?.phone || 'N/A'}

Estimated Delivery: ${estimatedDeliveryStr}

If you have any questions, contact us at totosbureau@gmail.com.

Thanks for choosing Toto's Bureau!
The Toto's Bureau Team
  `;

  return {
    to: customerEmail, // Fixed: Send confirmation to customer, not admin
    subject: `Order Confirmation #${order.orderNumber} - Toto's Bureau`,
    html,
    text
  };
};

export const generateOrderNotificationEmail = (orderData: OrderEmailData): EmailData => {
  const { order, customerName, customerEmail, customerFirstName, customerLastName, customerPhone } = orderData;
  
  // Extract first and last name if not provided separately
  const firstName = customerFirstName || (customerName ? customerName.split(' ')[0] : '');
  const lastName = customerLastName || (customerName ? customerName.split(' ').slice(1).join(' ') : '');
  const phone = customerPhone || order.shippingAddress.phone || 'Not provided';
  
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600;">${item.name}</div>
        <div style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

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
            ${firstName ? `<p><strong>First Name:</strong> ${firstName}</p>` : ''}
            ${lastName ? `<p><strong>Last Name:</strong> ${lastName}</p>` : ''}
            <p><strong>Full Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #059669;">${customerEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}" style="color: #059669;">${phone}</a></p>
            <p><strong>Payment Method:</strong> <span style="color: #059669; font-weight: 600; font-size: 16px;">${order.paymentMethod?.type || 'Not specified'}</span></p>
            ${order.paymentMethod?.type === 'Cash on Delivery' ? '<p style="color: #dc2626; font-weight: 600; background: #fef2f2; padding: 8px; border-radius: 4px; margin-top: 8px;">⚠️ Payment Pending - Cash on Delivery</p>' : ''}
            ${order.paymentMethod?.last4 && order.paymentMethod.last4 !== 'CASH' ? `<p><strong>Card Last 4 Digits:</strong> ****${order.paymentMethod.last4}</p>` : ''}
          </div>
          
          <div class="items-list">
            <h3 style="margin-top: 0; color: #111827;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top: 0; color: #111827;">Order Summary</h3>
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</p>
            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
            <p style="font-size: 18px; font-weight: 700; color: #111827; margin-top: 12px;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
          </div>
          
          <div class="customer-info">
            <h3 style="margin-top: 0; color: #111827;">Shipping Address</h3>
            <p style="line-height: 1.8; margin: 0;">
              <strong>${order.shippingAddress.name}</strong><br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              <strong>Phone:</strong> ${phone}
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
${firstName ? `First Name: ${firstName}` : ''}
${lastName ? `Last Name: ${lastName}` : ''}
Full Name: ${customerName}
Email: ${customerEmail}
Phone: ${phone}
Payment Method: ${order.paymentMethod?.type || 'Not specified'}
${order.paymentMethod?.type === 'Cash on Delivery' ? '⚠️ Payment Pending - Cash on Delivery' : ''}
${order.paymentMethod?.last4 && order.paymentMethod.last4 !== 'CASH' ? `Card Last 4: ****${order.paymentMethod.last4}` : ''}

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

// Wrapper functions for sending order emails
export const sendOrderConfirmationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  console.log('📧 [sendOrderConfirmationEmail] Called with:', {
    orderNumber: orderData.order?.orderNumber,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName,
    hasOrder: !!orderData.order,
    itemCount: orderData.order?.items?.length || 0
  });
  
  try {
    const emailData = generateOrderConfirmationEmail(orderData);
    // Update the 'to' field to use the customer's email
    emailData.to = orderData.customerEmail;
    emailData.subject = `Order Confirmation #${orderData.order.orderNumber} - Toto's Bureau`;
    
    // Attach orderData so sendEmail can extract individual template variables
    (emailData as any).orderData = orderData;
    
    console.log('📧 [sendOrderConfirmationEmail] Generated email data:', {
      to: emailData.to,
      subject: emailData.subject,
      htmlLength: emailData.html?.length || 0
    });
    
    const result = await sendEmail(emailData);
    console.log('📧 [sendOrderConfirmationEmail] Result:', result);
    return result;
  } catch (error) {
    console.error('❌ [sendOrderConfirmationEmail] Failed:', error);
    console.error('❌ [sendOrderConfirmationEmail] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
};

export const sendOrderNotificationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  console.log('📧 [sendOrderNotificationEmail] Called with:', {
    orderNumber: orderData.order?.orderNumber,
    customerEmail: orderData.customerEmail,
    customerName: orderData.customerName,
    hasOrder: !!orderData.order,
    itemCount: orderData.order?.items?.length || 0,
    adminTemplateConfigured: !!EMAILJS_TEMPLATE_ID_ADMIN
  });
  
  try {
    const emailData = generateOrderNotificationEmail(orderData);
    // Notification email ALWAYS goes to admin
    emailData.to = 'totosbureau@gmail.com';
    
    // Attach orderData so sendEmail can extract individual template variables
    (emailData as any).orderData = orderData;
    
    console.log('📧 [sendOrderNotificationEmail] Generated email data:', {
      to: emailData.to,
      subject: emailData.subject,
      htmlLength: emailData.html?.length || 0,
      isAdminEmail: true,
      willUseAdminTemplate: !!EMAILJS_TEMPLATE_ID_ADMIN
    });
    
    // Verify we're using admin template
    if (!EMAILJS_TEMPLATE_ID_ADMIN) {
      console.error('❌ CRITICAL: VITE_EMAILJS_TEMPLATE_ID_ADMIN is not set!');
      console.error('❌ Admin notification emails will use the wrong template!');
    }
    
    const result = await sendEmail(emailData);
    console.log('📧 [sendOrderNotificationEmail] Result:', result);
    return result;
  } catch (error) {
    console.error('❌ [sendOrderNotificationEmail] Failed:', error);
    console.error('❌ [sendOrderNotificationEmail] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
};