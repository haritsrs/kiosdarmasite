/**
 * HTML sanitization utilities
 * For production, consider using DOMPurify or similar library
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}

/**
 * Sanitize user input for display in HTML
 */
export function sanitizeForHtml(input: string): string {
  return escapeHtml(input).trim();
}

/**
 * Sanitize text for use in HTML attributes
 */
export function sanitizeForAttribute(input: string): string {
  return escapeHtml(input).replace(/\s+/g, " ").trim();
}

/**
 * Sanitize email content (basic - for simple text emails)
 * For HTML emails, use a proper HTML sanitizer
 */
export function sanitizeEmailContent(content: string): string {
  // Remove potential script tags and dangerous content
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}


