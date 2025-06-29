// Debug utility for OnChainScore
export class DebugLogger {
  private static isDebugMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  static log(category: string, message: string, data?: any) {
    if (this.isDebugMode) {
      console.group(`🔍 [${category}] ${message}`);
      if (data) {
        console.log(data);
      }
      console.groupEnd();
    }
  }

  static error(category: string, message: string, error?: any) {
    console.group(`❌ [${category}] ${message}`);
    if (error) {
      console.error(error);
    }
    console.groupEnd();
  }

  static warn(category: string, message: string, data?: any) {
    if (this.isDebugMode) {
      console.group(`⚠️ [${category}] ${message}`);
      if (data) {
        console.warn(data);
      }
      console.groupEnd();
    }
  }

  static success(category: string, message: string, data?: any) {
    if (this.isDebugMode) {
      console.group(`✅ [${category}] ${message}`);
      if (data) {
        console.log(data);
      }
      console.groupEnd();
    }
  }

  static network(message: string, request?: any, response?: any) {
    if (this.isDebugMode) {
      console.group(`🌐 [Network] ${message}`);
      if (request) {
        console.log('Request:', request);
      }
      if (response) {
        console.log('Response:', response);
      }
      console.groupEnd();
    }
  }

  static auth(message: string, data?: any) {
    if (this.isDebugMode) {
      console.group(`🔐 [Auth] ${message}`);
      if (data) {
        console.log(data);
      }
      console.groupEnd();
    }
  }
}

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  DebugLogger.error('Unhandled Promise', event.reason?.message || 'Unknown error', event.reason);
});

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  DebugLogger.error('JavaScript Error', event.message, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

export default DebugLogger;
