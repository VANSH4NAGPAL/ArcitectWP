import React, { useState, useEffect, useCallback } from "react";
import { logAdminAction, AUDIT_ACTIONS } from "../utils/auditLogger";

const AdminAuthWrapper = ({ children }) => {
  const [access, setAccess] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

  // Server-side authentication
  const authenticateWithServer = useCallback(async (username, password) => {
    try {
      const response = await fetch('/api/headinfo/auth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }, []);

  // Verify token with server
  const verifyTokenWithServer = useCallback(async (token) => {
    try {
      const response = await fetch('/api/headinfo/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return response.ok && data.valid;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }, []);

  // Check if session is valid
  const isValidSession = useCallback(async () => {
    const authData = sessionStorage.getItem("admin-auth");
    if (!authData) return false;

    try {
      const { token, timestamp } = JSON.parse(authData);
      
      // Check if session has expired locally
      if (Date.now() - timestamp > SESSION_DURATION) {
        sessionStorage.removeItem("admin-auth");
        return false;
      }

      // Verify with server
      const isValid = await verifyTokenWithServer(token);
      if (!isValid) {
        sessionStorage.removeItem("admin-auth");
        return false;
      }

      return true;
    } catch {
      sessionStorage.removeItem("admin-auth");
      return false;
    }
  }, [SESSION_DURATION, verifyTokenWithServer]);

  // Set secure session
  const setSecureSession = useCallback((token) => {
    const authData = {
      token,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem("admin-auth", JSON.stringify(authData));
  }, []);

  // Enhanced rate limiting with IP-based blocking
  const checkIpRateLimit = useCallback(async () => {
    try {
      const response = await fetch('/api/headinfo/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('IP rate limiting check failed:', error);
    }
    
    // Fallback to client-side only
    return { blocked: false, attempts: 0 };
  }, []);

  const recordIpFailedAttempt = useCallback(async () => {
    try {
      const response = await fetch('/api/headinfo/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record_failed' }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('IP rate limiting record failed:', error);
    }
    
    return { blocked: false, attempts: 0 };
  }, []);

  const clearIpRateLimit = useCallback(async () => {
    try {
      await fetch('/api/headinfo/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
    } catch (error) {
      console.warn('IP rate limiting clear failed:', error);
    }
  }, []);

  // Check lockout status (enhanced with IP checking)
  const checkLockout = useCallback(async () => {
    // Check IP-based rate limiting first
    const ipStatus = await checkIpRateLimit();
    if (ipStatus.blocked) {
      setIsLocked(true);
      setLockoutTime(Date.now() + (ipStatus.remainingTime * 1000));
      return true;
    }

    // Then check local device lockout
    const lockoutData = localStorage.getItem("admin-lockout");
    if (lockoutData) {
      const { attempts, lockTime } = JSON.parse(lockoutData);
      
      if (attempts >= MAX_ATTEMPTS) {
        const timeRemaining = LOCKOUT_DURATION - (Date.now() - lockTime);
        if (timeRemaining > 0) {
          setIsLocked(true);
          setLockoutTime(lockTime + LOCKOUT_DURATION);
          return true;
        } else {
          // Lockout expired, reset
          localStorage.removeItem("admin-lockout");
          setLoginAttempts(0);
        }
      }
    }
    return false;
  }, [MAX_ATTEMPTS, LOCKOUT_DURATION, checkIpRateLimit]);

  // Record failed attempt (enhanced with IP tracking)
  const recordFailedAttempt = useCallback(async () => {
    // Record IP-based failed attempt
    const ipResult = await recordIpFailedAttempt();
    
    // Also record local device attempt
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    const lockoutData = {
      attempts: newAttempts,
      lockTime: Date.now()
    };
    
    localStorage.setItem("admin-lockout", JSON.stringify(lockoutData));
    
    if (newAttempts >= MAX_ATTEMPTS || ipResult.blocked) {
      setIsLocked(true);
      setLockoutTime(Date.now() + LOCKOUT_DURATION);
    }
  }, [loginAttempts, MAX_ATTEMPTS, LOCKOUT_DURATION, recordIpFailedAttempt]);

  // Clear lockout (enhanced with IP clearing)
  const clearLockout = useCallback(async () => {
    // Clear IP-based rate limiting
    await clearIpRateLimit();
    
    // Clear local device lockout
    localStorage.removeItem("admin-lockout");
    setLoginAttempts(0);
    setIsLocked(false);
    setLockoutTime(null);
  }, [clearIpRateLimit]);

  useEffect(() => {
    const initAuth = async () => {
      // Check for lockout first
      const isLocked = await checkLockout();
      if (isLocked) {
        setIsLoading(false);
        return;
      }

      // Check existing session
      const validSession = await isValidSession();
      setAccess(validSession);
      setIsLoading(false);

      // Get current login attempts
      const lockoutData = localStorage.getItem("admin-lockout");
      if (lockoutData) {
        const { attempts } = JSON.parse(lockoutData);
        setLoginAttempts(attempts || 0);
      }
    };

    initAuth();
  }, [checkLockout, isValidSession]);

  useEffect(() => {
    // Listen for sessionStorage changes
    const handleStorage = async () => {
      const validSession = await isValidSession();
      if (!validSession) {
        setAccess(false);
      }
    };

    window.addEventListener("storage", handleStorage);
    
    // Check session validity periodically
    const sessionInterval = setInterval(async () => {
      const validSession = await isValidSession();
      if (!validSession) {
        setAccess(false);
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(sessionInterval);
    };
  }, [isValidSession]);

  // Handle countdown for lockout
  useEffect(() => {
    let interval;
    if (isLocked && lockoutTime) {
      interval = setInterval(() => {
        const timeRemaining = lockoutTime - Date.now();
        if (timeRemaining <= 0) {
          clearLockout();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTime, clearLockout]);

  const handleLogin = async () => {
    if (isLocked || !usernameInput.trim() || !passwordInput.trim()) return;

    setIsSubmitting(true);

    try {
      // Authenticate with server
      const authResult = await authenticateWithServer(usernameInput, passwordInput);
      
      if (authResult.success && authResult.token) {
        setSecureSession(authResult.token);
        setAccess(true);
        clearLockout();
        setUsernameInput("");
        setPasswordInput("");
        
        // Log successful login
        logAdminAction(AUDIT_ACTIONS.LOGIN, {
          method: 'server_auth',
          username: usernameInput,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Login failed:', err);
      
      // Log failed login attempt
      logAdminAction(AUDIT_ACTIONS.LOGIN_FAILED, {
        error: err.message,
        username: usernameInput,
        timestamp: Date.now(),
        attemptNumber: loginAttempts + 1
      });
      
      recordFailedAttempt();
      recordIpFailedAttempt();
      setUsernameInput("");
      setPasswordInput("");
      
      const remaining = MAX_ATTEMPTS - loginAttempts - 1;
      if (remaining > 0) {
        alert(`Wrong credentials. ${remaining} attempts remaining.`);
      } else {
        alert('Account locked for 15 minutes due to too many failed attempts.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLocked) {
      handleLogin();
    }
  };

  if (isLoading) {
    return (
      <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-100">
        <div className="!text-xl !text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!access) {
    const remainingTime = isLocked && lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 1000) : 0;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div className="!min-h-screen !flex !items-center !justify-center !bg-gray-100 !px-4">
        <div className="!bg-white !p-8 !rounded-xl !shadow-xl !w-full !max-w-sm">
          <h2 className="!text-xl !font-semibold !mb-4 !text-center !text-black">
            Admin Access
          </h2>
          
          {isLocked ? (
            <div className="!text-center !text-red-600 !mb-4">
              <div className="!font-semibold !mb-2">Account Locked</div>
              <div className="!text-sm">
                Too many failed attempts. Try again in {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          ) : (
            <>
              <div className="!mb-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg !text-black"
                  disabled={isLocked}
                />
              </div>
              
              <div className="!relative !mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="!w-full !px-4 !py-2 !pr-12 !border !border-gray-300 !rounded-lg !text-black"
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="!absolute !right-3 !top-1/2 !transform !-translate-y-1/2 !text-gray-500 hover:!text-gray-700 !focus:outline-none"
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="!w-5 !h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {loginAttempts > 0 && (
                <div className="!text-sm !text-red-600 !mb-2 !text-center">
                  {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. 
                  {MAX_ATTEMPTS - loginAttempts} remaining before lockout.
                </div>
              )}
              
              <button
                onClick={handleLogin}
                disabled={isLocked || !usernameInput.trim() || !passwordInput.trim() || isSubmitting}
                className="!w-full !bg-black !text-white !py-2 !rounded-lg hover:!bg-gray-800 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
              >
                {isSubmitting ? 'Authenticating...' : 'Login'}
              </button>
            </>
          )}
          
          <div className="!mt-4 !text-xs !text-gray-500 !text-center">
            Session expires in 2 hours
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
