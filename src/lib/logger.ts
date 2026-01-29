/**
 * Structured logging utility with PII scrubbing
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private correlationId: string | null = null;

  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const correlation = this.correlationId ? `[${this.correlationId}]` : "";
    const contextStr = context ? ` ${JSON.stringify(this.sanitize(context))}` : "";
    return `[${timestamp}] ${correlation} [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private sanitize(context: LogContext): LogContext {
    const sanitized: LogContext = { ...context };

    // Remove or mask sensitive fields
    const sensitiveKeys = ["password", "token", "secret", "key", "auth", "authorization", "cookie", "session"];

    Object.keys(sanitized).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitized[key] = "[REDACTED]";
      }

      // Mask emails
      if (lowerKey.includes("email") && typeof sanitized[key] === "string") {
        sanitized[key] = this.maskEmail(sanitized[key] as string);
      }

      // Mask phone numbers
      if ((lowerKey.includes("phone") || lowerKey.includes("tel")) && typeof sanitized[key] === "string") {
        sanitized[key] = this.maskPhone(sanitized[key] as string);
      }
    });

    return sanitized;
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return "***@***";
    const maskedLocal = localPart.length > 2 ? `${localPart[0]}***${localPart[localPart.length - 1]}` : "***";
    return `${maskedLocal}@${domain}`;
  }

  private maskPhone(phone: string): string {
    if (phone.length <= 4) return "***";
    return `${phone.slice(0, 2)}***${phone.slice(-2)}`;
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? {
          ...context,
          error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
          },
        }
      : context;
    console.error(this.formatMessage("error", message, errorContext));
  }
}

export const logger = new Logger();


