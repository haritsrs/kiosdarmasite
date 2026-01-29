/**
 * Error tracking utility
 * For production, integrate with Sentry or similar service
 */

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  url?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export function captureException(error: Error, context?: ErrorContext): void {
  // Scrub PII from error context
  const sanitizedContext = sanitizeContext(context);

  if (process.env.NODE_ENV === "production") {
    // TODO: Integrate with Sentry
    // Sentry.captureException(error, { extra: sanitizedContext });
    console.error("Error captured:", error, sanitizedContext);
  } else {
    console.error("Error in development:", error, sanitizedContext);
  }
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info", context?: ErrorContext): void {
  const sanitizedContext = sanitizeContext(context);

  if (process.env.NODE_ENV === "production") {
    // TODO: Integrate with Sentry
    // Sentry.captureMessage(message, level, { extra: sanitizedContext });
    console.log(`[${level.toUpperCase()}]`, message, sanitizedContext);
  } else {
    console.log(`[${level.toUpperCase()}]`, message, sanitizedContext);
  }
}

function sanitizeContext(context?: ErrorContext): ErrorContext | undefined {
  if (!context) return undefined;

  const sanitized: ErrorContext = { ...context };

  // Remove or mask sensitive data
  if (sanitized.userEmail) {
    sanitized.userEmail = maskEmail(sanitized.userEmail as string);
  }

  // Remove tokens, passwords, etc.
  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes("token") ||
      lowerKey.includes("password") ||
      lowerKey.includes("secret") ||
      lowerKey.includes("key") ||
      lowerKey.includes("auth")
    ) {
      delete sanitized[key];
    }
  });

  return sanitized;
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***@***";
  const maskedLocal = localPart.length > 2 ? `${localPart[0]}***${localPart[localPart.length - 1]}` : "***";
  return `${maskedLocal}@${domain}`;
}


