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
  const [remainingTime, setRemainingTime] = useState(0);
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
          setRemainingTime(0);
        } else {
          setRemainingTime(Math.ceil(timeRemaining / 1000));
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
        alert('Too many failed attempts. Please try again.');
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
    // Calculate remaining time for lockout
    const displayTime = isLocked && lockoutTime ? Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000)) : 0;
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          {isLocked ? (
            <div className="mb-4 text-center text-red-600">
              <div className="font-semibold">Too many failed attempts.</div>
              <div>
                Please wait <span className="font-mono">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span> before trying again.
              </div>
            </div>
          ) : null}
          <input
            type="text"
            className="w-full mb-2 p-2 border rounded"
            placeholder="Username"
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            disabled={isLocked || isSubmitting}
          />
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded pr-10"
              placeholder="Password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLocked || isSubmitting}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            onClick={handleLogin}
            disabled={isLocked || isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          {loginAttempts > 0 && !isLocked && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Attempts: {loginAttempts} / {MAX_ATTEMPTS}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthWrapper;
