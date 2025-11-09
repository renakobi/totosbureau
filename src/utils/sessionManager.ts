// Session management utility
// Handles session expiration, refresh, and cleanup

export interface SessionData {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  expiresAt: number; // Unix timestamp
  createdAt: number; // Unix timestamp
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_KEY = 'totos-bureau-session';
const REFRESH_THRESHOLD = 4 * 60 * 60 * 1000; // Refresh if less than 4 hours remaining

class SessionManager {
  /**
   * Create a new session
   */
  createSession(userId: string, username: string, email: string, isAdmin: boolean): SessionData {
    const now = Date.now();
    const session: SessionData = {
      userId,
      username,
      email,
      isAdmin,
      expiresAt: now + SESSION_DURATION,
      createdAt: now
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to store session:', e);
    }

    return session;
  }

  /**
   * Get current session if valid
   */
  getSession(): SessionData | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const session: SessionData = JSON.parse(stored);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }

      // Refresh session if close to expiration
      if (session.expiresAt - Date.now() < REFRESH_THRESHOLD) {
        this.refreshSession();
      }

      return session;
    } catch (e) {
      console.error('Failed to read session:', e);
      this.clearSession();
      return null;
    }
  }

  /**
   * Refresh session expiration
   */
  refreshSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return;

      const session: SessionData = JSON.parse(stored);
      session.expiresAt = Date.now() + SESSION_DURATION;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to refresh session:', e);
    }
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  /**
   * Clear session
   */
  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }

  /**
   * Get time until session expires (in milliseconds)
   */
  getTimeUntilExpiration(): number {
    const session = this.getSession();
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  }

  /**
   * Extend session by additional time
   */
  extendSession(additionalMs: number): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return;

      const session: SessionData = JSON.parse(stored);
      session.expiresAt += additionalMs;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to extend session:', e);
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();

