// Input sanitization utilities
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Basic email sanitization
  return email
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, '') // Keep only valid email characters
    .trim();
};

export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }
  
  // Keep only digits, spaces, hyphens, parentheses, and plus sign
  return phone.replace(/[^0-9\s\-\(\)\+]/g, '').trim();
};

export const sanitizeAddress = (address: string): string => {
  if (typeof address !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters but keep address-appropriate ones
  return address
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeProductName = (name: string): string => {
  if (typeof name !== 'string') {
    return '';
  }
  
  // Allow alphanumeric, spaces, hyphens, and common punctuation
  return name
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeDescription = (description: string): string => {
  if (typeof description !== 'string') {
    return '';
  }
  
  // More permissive for descriptions but still safe
  return description
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeComment = (comment: string): string => {
  if (typeof comment !== 'string') {
    return '';
  }
  
  // Basic sanitization for comments
  return comment
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate and sanitize form data
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      switch (key) {
        case 'email':
          sanitized[key] = sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(value);
          break;
        case 'street':
        case 'address':
          sanitized[key] = sanitizeAddress(value);
          break;
        case 'name':
        case 'productName':
          sanitized[key] = sanitizeProductName(value);
          break;
        case 'description':
          sanitized[key] = sanitizeDescription(value);
          break;
        case 'comment':
        case 'content':
          sanitized[key] = sanitizeComment(value);
          break;
        default:
          sanitized[key] = sanitizeString(value);
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Check for potentially malicious content
export const containsMaliciousContent = (input: string): boolean => {
  if (typeof input !== 'string') {
    return false;
  }
  
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /<form/i,
    /<input/i,
    /<button/i,
    /<select/i,
    /<textarea/i,
    /<option/i,
    /<optgroup/i,
    /<fieldset/i,
    /<legend/i,
    /<label/i,
    /<output/i,
    /<progress/i,
    /<meter/i,
    /<details/i,
    /<summary/i,
    /<dialog/i,
    /<menu/i,
    /<menuitem/i,
    /<command/i,
    /<keygen/i,
    /<source/i,
    /<track/i,
    /<video/i,
    /<audio/i,
    /<canvas/i,
    /<svg/i,
    /<math/i,
    /<applet/i,
    /<base/i,
    /<basefont/i,
    /<bgsound/i,
    /<blink/i,
    /<body/i,
    /<frame/i,
    /<frameset/i,
    /<head/i,
    /<html/i,
    /<img/i,
    /<isindex/i,
    /<keygen/i,
    /<layer/i,
    /<noframes/i,
    /<noscript/i,
    /<param/i,
    /<plaintext/i,
    /<script/i,
    /<title/i,
    /<xml/i,
    /<xss/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /<form/i,
    /<input/i,
    /<button/i,
    /<select/i,
    /<textarea/i,
    /<option/i,
    /<optgroup/i,
    /<fieldset/i,
    /<legend/i,
    /<label/i,
    /<output/i,
    /<progress/i,
    /<meter/i,
    /<details/i,
    /<summary/i,
    /<dialog/i,
    /<menu/i,
    /<menuitem/i,
    /<command/i,
    /<keygen/i,
    /<source/i,
    /<track/i,
    /<video/i,
    /<audio/i,
    /<canvas/i,
    /<svg/i,
    /<math/i,
    /<applet/i,
    /<base/i,
    /<basefont/i,
    /<bgsound/i,
    /<blink/i,
    /<body/i,
    /<frame/i,
    /<frameset/i,
    /<head/i,
    /<html/i,
    /<img/i,
    /<isindex/i,
    /<keygen/i,
    /<layer/i,
    /<noframes/i,
    /<noscript/i,
    /<param/i,
    /<plaintext/i,
    /<script/i,
    /<title/i,
    /<xml/i,
    /<xss/i
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};
