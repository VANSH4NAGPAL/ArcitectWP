// Audit logging utility for admin actions
class AuditLogger {
  constructor() {
    this.logs = this.loadLogs();
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  // Load logs from localStorage
  loadLogs() {
    try {
      const logs = localStorage.getItem('admin-audit-logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  // Save logs to localStorage
  saveLogs() {
    try {
      // Keep only the most recent logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }
      localStorage.setItem('admin-audit-logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  // Log an admin action
  log(action, details = {}) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId()
    };

    this.logs.push(logEntry);
    this.saveLogs();

    // Also send to server for permanent storage (if available)
    this.sendToServer(logEntry);

    console.log('Audit Log:', logEntry);
  }

  // Get current session ID
  getSessionId() {
    try {
      const authData = sessionStorage.getItem('admin-auth');
      if (authData) {
        const { timestamp } = JSON.parse(authData);
        return `session_${timestamp}`;
      }
    } catch {
      // Ignore errors
    }
    return 'unknown_session';
  }

  // Send log to server for persistent storage
  async sendToServer(logEntry) {
    try {
      // Send to new persistent storage endpoint
      await fetch('/api/admin/store-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fail silently - local logs are still kept
      console.warn('Failed to send audit log to server:', error);
      
      // Fallback to original audit-log endpoint
      try {
        await fetch('/api/admin/audit-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      } catch (fallbackError) {
        console.warn('Fallback audit log also failed:', fallbackError);
      }
    }
  }

  // Get all logs
  getAllLogs() {
    return [...this.logs].reverse(); // Most recent first
  }

  // Get logs for a specific action
  getLogsByAction(action) {
    return this.logs.filter(log => log.action === action);
  }

  // Get logs within a time range
  getLogsByTimeRange(startTime, endTime) {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= startTime && logTime <= endTime;
    });
  }

  // Clear all logs (admin action)
  clearLogs() {
    this.log('CLEAR_AUDIT_LOGS', { clearedCount: this.logs.length });
    this.logs = [];
    this.saveLogs();
  }

  // Export logs as JSON
  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `admin-audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.log('EXPORT_AUDIT_LOGS', { exportedCount: this.logs.length });
  }
}

// Create singleton instance
const auditLogger = new AuditLogger();

// Admin action types
export const AUDIT_ACTIONS = {
  LOGIN: 'ADMIN_LOGIN',
  LOGOUT: 'ADMIN_LOGOUT',
  LOGIN_FAILED: 'ADMIN_LOGIN_FAILED',
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PROJECT_DELETE: 'PROJECT_DELETE',
  PROJECT_VIEW: 'PROJECT_VIEW',
  IMAGE_UPLOAD: 'IMAGE_UPLOAD',
  IMAGE_DELETE: 'IMAGE_DELETE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  EXPORT_DATA: 'EXPORT_DATA',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION'
};

// Convenience functions
export const logAdminAction = (action, details) => {
  auditLogger.log(action, details);
};

export const getAuditLogs = () => {
  return auditLogger.getAllLogs();
};

export const exportAuditLogs = () => {
  auditLogger.exportLogs();
};

export const clearAuditLogs = () => {
  auditLogger.clearLogs();
};

export default auditLogger;
