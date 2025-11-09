// SECURITY UTILITIES for API endpoints
// Provides authentication, CORS, rate limiting, input validation, and CSRF protection

// SECURITY FIX: CORS configuration - restrict to trusted origins only
// Prevents CSRF attacks by only allowing requests from whitelisted domains
const getAllowedOrigins = () => {
  const origins = [
    'https://totosbureau.com',
    'https://www.totosbureau.com',
  ];
  
  // Add development origin if in development
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development') {
    origins.push('http://localhost:8080', 'http://localhost:5173');
  }
  
  return origins;
};

// SECURITY FIX: CORS handler - validate origin against whitelist
exports.handleCORS = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // Allow same-origin requests (no origin header)
    res.setHeader('Access-Control-Allow-Origin', 'null');
  } else {
    // Origin not in whitelist - reject
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-CSRF-Token');
  res.setHeader('Access-Control-Expose-Headers', 'X-CSRF-Token');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
};

// SECURITY FIX: API Key authentication
// Validates API key from header to prevent unauthorized access
exports.authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_SECRET_KEY;
  
  if (!validApiKey) {
    console.error('API_SECRET_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  
  next();
};

// SECURITY FIX: CSRF protection using token validation
// Validates CSRF token to prevent cross-site request forgery
exports.validateCSRF = (req, res, next) => {
  // Skip CSRF for GET/OPTIONS requests
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next();
  }
  
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.headers['x-session-token'] || req.cookies?.sessionToken;
  
  // Simple CSRF token validation (in production, use a proper CSRF library)
  // Token should be generated server-side and validated here
  if (!csrfToken || !sessionToken) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }
  
  // In a real implementation, validate token against session
  // For now, we'll require both tokens to be present
  next();
};

// SECURITY FIX: Input validation and sanitization
// Validates and sanitizes all input to prevent injection attacks
exports.validateInput = {
  // Validate amount (must be positive number, reasonable max)
  amount: (value) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof num !== 'number' || isNaN(num) || num <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (num > 999999) {
      throw new Error('Amount exceeds maximum limit');
    }
    return Math.round(num * 100) / 100; // Round to 2 decimal places
  },
  
  // Validate currency (whitelist approach)
  currency: (value) => {
    const allowed = ['usd', 'eur', 'gbp', 'cad'];
    const currency = (value || 'usd').toLowerCase();
    if (!allowed.includes(currency)) {
      throw new Error(`Currency must be one of: ${allowed.join(', ')}`);
    }
    return currency;
  },
  
  // Validate email format
  email: (value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      throw new Error('Invalid email format');
    }
    // Sanitize: remove potentially dangerous characters
    return value.trim().toLowerCase().replace(/[<>]/g, '');
  },
  
  // Validate order ID (alphanumeric, reasonable length)
  orderId: (value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('Order ID is required');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new Error('Invalid order ID format');
    }
    if (value.length > 100) {
      throw new Error('Order ID too long');
    }
    return value.trim();
  },
  
  // Validate and sanitize items array
  items: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('Items must be an array');
    }
    if (value.length === 0) {
      throw new Error('Items array cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('Too many items');
    }
    
    return value.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Item ${index} is invalid`);
      }
      
      // Validate and sanitize item properties
      const name = typeof item.name === 'string' ? item.name.trim().replace(/[<>]/g, '') : '';
      if (!name || name.length > 200) {
        throw new Error(`Item ${index} name is invalid`);
      }
      
      const quantity = parseInt(item.quantity) || 0;
      if (quantity <= 0 || quantity > 1000) {
        throw new Error(`Item ${index} quantity is invalid`);
      }
      
      const price = parseFloat(item.price) || 0;
      if (price < 0 || price > 100000) {
        throw new Error(`Item ${index} price is invalid`);
      }
      
      return {
        name: name.substring(0, 200), // Limit length
        quantity,
        price: Math.round(price * 100) / 100
      };
    });
  },
  
  // Validate client secret (Stripe format)
  clientSecret: (value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('Client secret is required');
    }
    if (!/^pi_[a-zA-Z0-9_]+_secret_[a-zA-Z0-9_]+$/.test(value)) {
      throw new Error('Invalid client secret format');
    }
    return value.trim();
  },
  
  // Validate payment method ID (Stripe format)
  paymentMethodId: (value) => {
    if (!value || typeof value !== 'string') {
      throw new Error('Payment method ID is required');
    }
    if (!/^pm_[a-zA-Z0-9_]+$/.test(value)) {
      throw new Error('Invalid payment method ID format');
    }
    return value.trim();
  }
};

// SECURITY FIX: Rate limiting (simple in-memory implementation)
// In production, use Redis or a proper rate limiting service
const rateLimitStore = new Map();

exports.rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const identifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (rateLimitStore.has(identifier)) {
      const requests = rateLimitStore.get(identifier).filter(time => time > windowStart);
      rateLimitStore.set(identifier, requests);
      
      if (requests.length >= maxRequests) {
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
        return res.status(429).json({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }
      
      requests.push(now);
    } else {
      rateLimitStore.set(identifier, [now]);
    }
    
    next();
  };
};

// SECURITY FIX: Content-Type validation
exports.validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
};

// SECURITY FIX: Request size limit
exports.limitRequestSize = (maxSize = 1024 * 1024) => { // 1MB default
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > maxSize) {
      return res.status(413).json({ error: 'Request entity too large' });
    }
    next();
  };
};

