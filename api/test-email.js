// Simple test endpoint to check email configuration
export default async function handler(req, res) {
  const hasEmailUser = !!process.env.EMAIL_USER;
  const hasEmailPass = !!process.env.EMAIL_PASS;
  const emailUser = process.env.EMAIL_USER || 'NOT SET';
  
  res.status(200).json({
    configured: hasEmailUser && hasEmailPass,
    hasEmailUser,
    hasEmailPass,
    emailUser: emailUser.substring(0, 3) + '***' + emailUser.substring(emailUser.length - 3),
    message: hasEmailUser && hasEmailPass 
      ? 'Email service is configured' 
      : 'Email service is NOT configured. Set EMAIL_USER and EMAIL_PASS in Vercel environment variables.'
  });
};

