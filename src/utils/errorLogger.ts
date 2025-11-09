// Comprehensive error logging utility
// Provides structured error logging with context and severity levels

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

class ErrorLogger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  /**
   * Log an error with context and severity
   */
  logError(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext
  ): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorData = {
      message: errorObj.message,
      stack: errorObj.stack,
      severity,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        userAgent: context?.userAgent || navigator.userAgent,
        url: context?.url || window.location.href,
      },
      environment: this.isProduction ? 'production' : 'development'
    };

    // Always log to console in development
    if (this.isDevelopment) {
      console.error(`[${severity.toUpperCase()}]`, errorData);
    }

    // In production, send to error tracking service
    if (this.isProduction) {
      this.sendToErrorService(errorData);
    }

    // Store in localStorage for debugging (limited to last 10 errors)
    this.storeErrorLocally(errorData);
  }

  /**
   * Log API errors with request context
   */
  logApiError(
    error: Error | string,
    endpoint: string,
    method: string,
    requestData?: any,
    response?: Response
  ): void {
    const context: ErrorContext = {
      component: 'API',
      action: `${method} ${endpoint}`,
      additionalData: {
        endpoint,
        method,
        requestData: this.sanitizeData(requestData),
        status: response?.status,
        statusText: response?.statusText
      }
    };

    const severity = response?.status === 401 || response?.status === 403
      ? ErrorSeverity.HIGH
      : response?.status && response.status >= 500
      ? ErrorSeverity.CRITICAL
      : ErrorSeverity.MEDIUM;

    this.logError(error, severity, context);
  }

  /**
   * Log authentication errors
   */
  logAuthError(error: Error | string, action: string, userId?: string): void {
    this.logError(error, ErrorSeverity.HIGH, {
      component: 'Authentication',
      action,
      userId,
      additionalData: { action }
    });
  }

  /**
   * Log payment errors (critical)
   */
  logPaymentError(error: Error | string, transactionId?: string, amount?: number): void {
    this.logError(error, ErrorSeverity.CRITICAL, {
      component: 'Payment',
      action: 'Payment Processing',
      additionalData: {
        transactionId,
        amount: amount ? `$${(amount / 100).toFixed(2)}` : undefined
      }
    });
  }

  /**
   * Send error to error tracking service (e.g., Sentry, LogRocket)
   * TODO: Integrate with actual error tracking service
   */
  private sendToErrorService(errorData: any): void {
    // In production, integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: errorData });
    
    // For now, log to console (in production, this would go to a logging service)
    if (errorData.severity === ErrorSeverity.CRITICAL || errorData.severity === ErrorSeverity.HIGH) {
      console.error('Critical/High severity error:', errorData);
      // TODO: Send to monitoring service
    }
  }

  /**
   * Store error locally for debugging (limited storage)
   */
  private storeErrorLocally(errorData: any): void {
    try {
      const stored = localStorage.getItem('error-log');
      const errors = stored ? JSON.parse(stored) : [];
      
      // Keep only last 10 errors
      errors.unshift(errorData);
      if (errors.length > 10) {
        errors.pop();
      }
      
      localStorage.setItem('error-log', JSON.stringify(errors));
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'creditCard', 'cvv'];
    const sanitized = { ...data };

    for (const key in sanitized) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    }

    return sanitized;
  }

  /**
   * Get stored errors for debugging
   */
  getStoredErrors(): any[] {
    try {
      const stored = localStorage.getItem('error-log');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors(): void {
    localStorage.removeItem('error-log');
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export convenience functions
export const logError = (error: Error | string, severity?: ErrorSeverity, context?: ErrorContext) => {
  errorLogger.logError(error, severity, context);
};

export const logApiError = (
  error: Error | string,
  endpoint: string,
  method: string,
  requestData?: any,
  response?: Response
) => {
  errorLogger.logApiError(error, endpoint, method, requestData, response);
};

export const logAuthError = (error: Error | string, action: string, userId?: string) => {
  errorLogger.logAuthError(error, action, userId);
};

export const logPaymentError = (error: Error | string, transactionId?: string, amount?: number) => {
  errorLogger.logPaymentError(error, transactionId, amount);
};

