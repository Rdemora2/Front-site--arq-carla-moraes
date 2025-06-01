/**
 * Testes para o sistema de Logger
 */

import logger, { useLogger } from "../../utils/logger";
import { renderHook, act } from "@testing-library/react";

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do fetch
global.fetch = jest.fn();

// Mock do performance
global.performance = {
  ...global.performance,
  now: jest.fn(() => 1234567890),
  memory: {
    usedJSHeapSize: 5000000,
    totalJSHeapSize: 10000000,
    jsHeapSizeLimit: 100000000,
  },
  timing: {},
};

// Mock do gtag
global.gtag = jest.fn();

describe("Logger System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("[]");
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  describe("Logger Core Functionality", () => {
    test("should create log entries with proper structure", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      logger.info("Test message", { key: "value" });

      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0];
      expect(logCall[0]).toContain("[INFO]");
      expect(logCall[0]).toContain("Test message");

      consoleSpy.mockRestore();
    });

    test("should handle different log levels", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation();
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();
      const logSpy = jest.spyOn(console, "log").mockImplementation();

      logger.error("Error message");
      logger.warn("Warning message");
      logger.info("Info message");
      logger.debug("Debug message");

      expect(errorSpy).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
      warnSpy.mockRestore();
      logSpy.mockRestore();
    });

    test("should implement rate limiting", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      // Send 15 identical messages (limit is 10)
      for (let i = 0; i < 15; i++) {
        logger.info("Repeated message");
      }

      // Should be called exactly 10 times due to rate limiting
      expect(consoleSpy).toHaveBeenCalledTimes(10);

      consoleSpy.mockRestore();
    });

    test("should save logs to localStorage", () => {
      logger.info("Test message for storage");

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "app_logs",
        expect.any(String)
      );
    });

    test("should handle localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage full");
      });

      expect(() => {
        logger.info("Test message");
      }).not.toThrow();
    });
  });

  describe("Specialized Logging Methods", () => {
    test("should log user actions with correct metadata", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      logger.userAction("button_click", { buttonId: "submit" });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("User Action: button_click"),
        expect.any(String),
        expect.objectContaining({
          category: "user_interaction",
          buttonId: "submit",
        })
      );

      consoleSpy.mockRestore();
    });

    test("should log API calls with performance data", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      logger.apiCall("GET", "/api/users", 404, 2500);

      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    test("should log page views with navigation data", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      logger.pageView("/home");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Page View: /home"),
        expect.any(String),
        expect.objectContaining({
          category: "navigation",
          route: "/home",
        })
      );

      consoleSpy.mockRestore();
    });

    test("should log feature usage", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      logger.featureUsage("dark_mode");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Feature Used: dark_mode"),
        expect.any(String),
        expect.objectContaining({
          category: "feature_usage",
          feature: "dark_mode",
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    test("should capture global errors", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      // Simulate global error
      const errorEvent = new ErrorEvent("error", {
        message: "Test error",
        filename: "test.js",
        lineno: 10,
        colno: 5,
        error: new Error("Test error"),
      });

      window.dispatchEvent(errorEvent);

      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    test("should capture unhandled promise rejections", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation();

      // Simulate unhandled promise rejection
      const rejectionEvent = new PromiseRejectionEvent("unhandledrejection", {
        promise: Promise.reject("Test rejection"),
        reason: "Test rejection",
      });

      window.dispatchEvent(rejectionEvent);

      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  describe("Performance Metrics", () => {
    test("should track performance metrics", () => {
      const stats = logger.getPerformanceStats();

      expect(stats).toHaveProperty("errors");
      expect(stats).toHaveProperty("warnings");
      expect(stats).toHaveProperty("userInteractions");
      expect(stats).toHaveProperty("sessionDuration");
      expect(stats).toHaveProperty("errorRate");
    });

    test("should update metrics on different log levels", () => {
      const initialStats = logger.getPerformanceStats();

      logger.error("Test error");
      logger.warn("Test warning");

      const updatedStats = logger.getPerformanceStats();

      expect(updatedStats.errors).toBe(initialStats.errors + 1);
      expect(updatedStats.warnings).toBe(initialStats.warnings + 1);
    });
  });

  describe("Log Flushing", () => {
    test("should send logs to remote endpoint in production", async () => {
      process.env.NODE_ENV = "production";
      process.env.REACT_APP_LOGGING_ENDPOINT = "https://api.example.com/logs";

      logger.info("Test message for remote");

      await logger.flush();

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/logs",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.any(String),
        })
      );
    });

    test("should send error events to Google Analytics", async () => {
      logger.error("Test error for analytics");

      await logger.flush();

      expect(gtag).toHaveBeenCalledWith(
        "event",
        "exception",
        expect.objectContaining({
          description: "Test error for analytics",
          fatal: false,
        })
      );
    });

    test("should handle flush errors gracefully", async () => {
      fetch.mockRejectedValue(new Error("Network error"));
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      logger.info("Test message");
      await logger.flush();

      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to send logs:",
        expect.any(Error)
      );

      warnSpy.mockRestore();
    });
  });

  describe("Cache Management", () => {
    test("should clear old logs", () => {
      logger.clearOldLogs();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("app_logs");
    });

    test("should retrieve saved logs", () => {
      const mockLogs = [{ id: "1", message: "test" }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLogs));

      const savedLogs = logger.getSavedLogs();

      expect(savedLogs).toEqual(mockLogs);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("app_logs");
    });

    test("should handle invalid JSON in localStorage", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");
      const warnSpy = jest.spyOn(logger, "warn").mockImplementation();

      const savedLogs = logger.getSavedLogs();

      expect(savedLogs).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to retrieve saved logs",
        expect.objectContaining({
          error: expect.any(String),
        })
      );

      warnSpy.mockRestore();
    });
  });

  describe("Export Functionality", () => {
    test("should export logs as downloadable file", () => {
      // Mock URL.createObjectURL and related APIs
      global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
      global.URL.revokeObjectURL = jest.fn();

      const mockElement = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      jest.spyOn(document, "createElement").mockReturnValue(mockElement);

      logger.exportLogs();

      expect(mockElement.click).toHaveBeenCalled();
      expect(mockElement.download).toContain("logs-");
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});

describe("useLogger Hook", () => {
  test("should provide logging methods", () => {
    const { result } = renderHook(() => useLogger());

    expect(result.current).toHaveProperty("logUserAction");
    expect(result.current).toHaveProperty("logError");
    expect(result.current).toHaveProperty("logApiCall");
    expect(result.current).toHaveProperty("logPageView");
    expect(result.current).toHaveProperty("logFeatureUsage");
    expect(result.current).toHaveProperty("logger");
  });

  test("should log user actions through hook", () => {
    const { result } = renderHook(() => useLogger());
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    act(() => {
      result.current.logUserAction("test_action", { key: "value" });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("User Action: test_action"),
      expect.any(String),
      expect.objectContaining({
        category: "user_interaction",
        key: "value",
      })
    );

    consoleSpy.mockRestore();
  });

  test("should log errors through hook", () => {
    const { result } = renderHook(() => useLogger());
    const errorSpy = jest.spyOn(console, "error").mockImplementation();

    const testError = new Error("Test error");

    act(() => {
      result.current.logError(testError, { context: "test" });
    });

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  test("should log API calls through hook", () => {
    const { result } = renderHook(() => useLogger());
    const logSpy = jest.spyOn(console, "log").mockImplementation();

    act(() => {
      result.current.logApiCall("POST", "/api/test", 200, 1500);
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("API POST /api/test"),
      expect.any(String),
      expect.objectContaining({
        category: "api_call",
        method: "POST",
        url: "/api/test",
        status: 200,
        duration: 1500,
      })
    );

    logSpy.mockRestore();
  });
});
