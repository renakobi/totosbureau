const sgMail = require('@sendgrid/mail');

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Test email - REPLACE WITH YOUR VERIFIED EMAIL
const msg = {
  to: 'test@example.com',
  from: 'YOUR_VERIFIED_EMAIL@domain.com', // Replace with your verified email from SendGrid
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', error.response?.body);
  });
