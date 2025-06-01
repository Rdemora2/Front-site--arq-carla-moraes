class Logger {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.logBuffer = [];
    this.rateLimiter = new Map();
    this.maxBufferSize = 1000;
    this.flushInterval = 5000;
    this.isEnabled = this.getEnvironment() !== "test";

    this.initializePerformanceMetrics();
    this.initializeErrorHandlers();
    this.startFlushTimer();
  }

  getEnvironment() {
    try {
      return import.meta.env?.MODE || "production";
    } catch (error) {
      return "production";
    }
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  initializePerformanceMetrics() {
    this.performanceMarks = {
      pageLoad: performance.now(),
      userInteractions: 0,
      errors: 0,
      warnings: 0,
    };
  }

  initializeErrorHandlers() {
    window.addEventListener("error", (event) => {
      this.error("Global Error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        type: "javascript_error",
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.error("Unhandled Promise Rejection", {
        reason: event.reason,
        type: "promise_rejection",
      });
    });

    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          const source = event.target.src || event.target.href;
          if (
            source &&
            typeof source === "string" &&
            !source.includes("[object Object]")
          ) {
            this.error("Resource Error", {
              tagName: event.target.tagName,
              source: source,
              type: "resource_error",
            });
          }
        }
      },
      true
    );
  }

  startFlushTimer() {
    setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  isRateLimited(key, limit = 10, window = 60000) {
    const now = Date.now();
    const windowStart = now - window;

    if (!this.rateLimiter.has(key)) {
      this.rateLimiter.set(key, []);
    }

    const timestamps = this.rateLimiter.get(key);
    const recentTimestamps = timestamps.filter((ts) => ts > windowStart);

    if (recentTimestamps.length >= limit) {
      return true;
    }

    recentTimestamps.push(now);
    this.rateLimiter.set(key, recentTimestamps);
    return false;
  }

  createLogEntry(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const correlationId = this.generateCorrelationId();

    return {
      id: correlationId,
      timestamp,
      level,
      message,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      performance: {
        memory: performance.memory
          ? {
              used: performance.memory.usedJSHeapSize,
              total: performance.memory.totalJSHeapSize,
              limit: performance.memory.jsHeapSizeLimit,
            }
          : null,
        timing: performance.timing,
      },
      metadata: {
        ...metadata,
        stack: new Error().stack,
      },
    };
  }

  generateCorrelationId() {
    return `${this.sessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }

  log(level, message, metadata = {}) {
    if (!this.isEnabled) return;

    const logKey = `${level}-${message}`;
    if (this.isRateLimited(logKey)) {
      return;
    }

    const logEntry = this.createLogEntry(level, message, metadata);

    this.outputToConsole(logEntry);

    this.addToBuffer(logEntry);

    this.saveToLocalStorage(logEntry);

    this.updatePerformanceMetrics(level);
  }

  outputToConsole(logEntry) {
    const { level, message, metadata, timestamp } = logEntry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    const styles = {
      error: "color: #ff4444; font-weight: bold;",
      warn: "color: #ffaa00; font-weight: bold;",
      info: "color: #4444ff;",
      debug: "color: #888888;",
    };

    if (level === "error" || level === "warn") {
      console.group(`%c${prefix} ${message}`, styles[level]);
      console.error("Metadata:", metadata);
      if (metadata.stack) {
        console.trace("Stack Trace");
      }
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${message}`, styles[level], metadata);
    }
  }

  addToBuffer(logEntry) {
    this.logBuffer.push(logEntry);

    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  saveToLocalStorage(logEntry) {
    try {
      const storageKey = "app_logs";
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existingLogs.push(logEntry);

      const recentLogs = existingLogs.slice(-100);
      localStorage.setItem(storageKey, JSON.stringify(recentLogs));
    } catch (error) {}
  }

  updatePerformanceMetrics(level) {
    switch (level) {
      case "error":
        this.performanceMarks.errors++;
        break;
      case "warn":
        this.performanceMarks.warnings++;
        break;
    }
  }

  error(message, metadata = {}) {
    this.log("error", message, { ...metadata, severity: "high" });
  }

  warn(message, metadata = {}) {
    this.log("warn", message, { ...metadata, severity: "medium" });
  }

  info(message, metadata = {}) {
    this.log("info", message, { ...metadata, severity: "low" });
  }

  debug(message, metadata = {}) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, metadata);
    }
  }

  userAction(action, metadata = {}) {
    this.performanceMarks.userInteractions++;
    this.info(`User Action: ${action}`, {
      ...metadata,
      category: "user_interaction",
      timestamp: Date.now(),
    });
  }

  apiCall(method, url, status, duration, metadata = {}) {
    const level = status >= 400 ? "error" : status >= 300 ? "warn" : "info";
    this.log(level, `API ${method} ${url}`, {
      ...metadata,
      category: "api_call",
      method,
      url,
      status,
      duration,
      performance: {
        slow: duration > 3000,
        timeout: status === 0,
      },
    });
  }

  pageView(route, metadata = {}) {
    this.info(`Page View: ${route}`, {
      ...metadata,
      category: "navigation",
      route,
      referrer: document.referrer,
      loadTime: performance.now() - this.performanceMarks.pageLoad,
    });
  }

  featureUsage(feature, metadata = {}) {
    this.info(`Feature Used: ${feature}`, {
      ...metadata,
      category: "feature_usage",
      feature,
    });
  }

  async flush() {
    if (this.logBuffer.length === 0) return;

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      if (
        process.env.NODE_ENV === "production" &&
        process.env.REACT_APP_LOGGING_ENDPOINT
      ) {
        await fetch(process.env.REACT_APP_LOGGING_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: this.sessionId,
            logs: logsToSend,
            metadata: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              performance: this.performanceMarks,
            },
          }),
        });
      }

      if (typeof gtag !== "undefined") {
        const errorLogs = logsToSend.filter((log) => log.level === "error");
        errorLogs.forEach((log) => {
          gtag("event", "exception", {
            description: log.message,
            fatal: false,
            custom_map: {
              correlation_id: log.id,
            },
          });
        });
      }
    } catch (error) {
      console.warn("Failed to send logs:", error);
    }
  }

  clearOldLogs() {
    try {
      localStorage.removeItem("app_logs");
      this.logBuffer = [];
      this.rateLimiter.clear();
    } catch (error) {
      this.warn("Failed to clear old logs", { error: error.message });
    }
  }

  getSavedLogs() {
    try {
      return JSON.parse(localStorage.getItem("app_logs") || "[]");
    } catch (error) {
      this.warn("Failed to retrieve saved logs", { error: error.message });
      return [];
    }
  }

  exportLogs() {
    const allLogs = {
      session: this.sessionId,
      buffer: this.logBuffer,
      saved: this.getSavedLogs(),
      performance: this.performanceMarks,
    };

    const blob = new Blob([JSON.stringify(allLogs, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getPerformanceStats() {
    return {
      ...this.performanceMarks,
      sessionDuration: Date.now() - this.performanceMarks.pageLoad,
      logsGenerated: this.logBuffer.length,
      errorRate:
        this.performanceMarks.errors /
        (this.performanceMarks.userInteractions || 1),
    };
  }
}

const logger = new Logger();

export const useLogger = () => {
  const logUserAction = (action, metadata) => {
    logger.userAction(action, metadata);
  };

  const logError = (error, metadata) => {
    logger.error(error.message || error, {
      ...metadata,
      stack: error.stack,
      name: error.name,
    });
  };

  const logApiCall = (method, url, status, duration, metadata) => {
    logger.apiCall(method, url, status, duration, metadata);
  };

  const logPageView = (route, metadata) => {
    logger.pageView(route, metadata);
  };

  const logFeatureUsage = (feature, metadata) => {
    logger.featureUsage(feature, metadata);
  };
  return {
    logUserAction,
    logError,
    logApiCall,
    logPageView,
    logFeatureUsage,
    logger,
  };
};

export default logger;
