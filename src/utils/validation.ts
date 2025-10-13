export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: string, rules: ValidationRule): string | null => {
  try {
    // Ensure value is a string
    const fieldValue = value || '';
    
    if (!rules || typeof rules !== 'object') {
      console.error('Invalid rules passed to validateField:', rules);
      return 'Invalid validation rules';
    }

    if (rules.required && (!fieldValue || fieldValue.trim() === '')) {
      return 'This field is required';
    }

    if (fieldValue && rules.minLength && fieldValue.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (fieldValue && rules.maxLength && fieldValue.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    if (fieldValue && rules.pattern && !rules.pattern.test(fieldValue)) {
      return 'Invalid format';
    }

    if (fieldValue && rules.custom && typeof rules.custom === 'function') {
      try {
        return rules.custom(fieldValue);
      } catch (customError) {
        console.error('Error in custom validation:', customError);
        return 'Validation error';
      }
    }

    return null;
  } catch (error) {
    console.error('Error in validateField:', error);
    return 'Validation error';
  }
};

export const validateForm = (data: Record<string, string>, rules: Record<string, ValidationRule>): ValidationErrors => {
  try {
    const errors: ValidationErrors = {};

    if (!data || typeof data !== 'object') {
      console.error('Invalid data passed to validateForm:', data);
      return { general: 'Invalid form data' };
    }

    if (!rules || typeof rules !== 'object') {
      console.error('Invalid rules passed to validateForm:', rules);
      return { general: 'Invalid validation rules' };
    }

    Object.keys(rules).forEach(field => {
      try {
        // Ensure the field value is a string
        const fieldValue = data[field] || '';
        const error = validateField(fieldValue, rules[field]);
        if (error) {
          errors[field] = error;
        }
      } catch (fieldError) {
        console.error(`Error validating field ${field}:`, fieldError);
        errors[field] = 'Validation error for this field';
      }
    });

    return errors;
  } catch (error) {
    console.error('Error in validateForm:', error);
    return { general: 'Validation failed' };
  }
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      if (value.trim().length < 2) {
        return 'Name must be at least 2 characters';
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return 'Name can only contain letters and spaces';
      }
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (!/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  price: {
    required: true,
    custom: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Price must be a positive number';
      }
      return null;
    }
  },
  stock: {
    required: true,
    custom: (value: string) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 0) {
        return 'Stock must be a non-negative number';
      }
      return null;
    }
  }
};
