/**
 * Format utilities: Currency, date, and number formatting
 * Matches PPSI POS FormatUtils for consistency
 * Locale: Indonesian (id-ID), Currency: IDR
 */

/**
 * Format amount as Indonesian Rupiah (IDR)
 * @param amount - Number to format
 * @returns Formatted string, e.g., "Rp 15.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date with full details
 * @param date - Date to format
 * @returns Formatted string, e.g., "24 Jan 2025, 14:30"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

/**
 * Format date in short format
 * @param date - Date to format
 * @returns Formatted string, e.g., "24/01/25"
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(dateObj);
}

/**
 * Format time only
 * @param date - Date to extract time from
 * @returns Formatted string, e.g., "14:30"
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

/**
 * Format phone number to E.164 format for WhatsApp
 * @param phoneNumber - Phone number to format
 * @returns E.164 formatted number, e.g., "+628123456789"
 * @throws Error if phone number is invalid
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except + at start
  const cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // If starts with 0, replace with +62
  if (cleaned.startsWith("0")) {
    return "+62" + cleaned.slice(1);
  }

  // If starts with 62, add +
  if (cleaned.startsWith("62")) {
    return "+" + cleaned;
  }

  // If already has +, return as-is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  throw new Error(`Invalid phone number format: ${phoneNumber}`);
}

/**
 * Validate WhatsApp phone number
 * @param phoneNumber - Phone number to validate
 * @returns true if valid
 */
export function isValidWhatsappPhone(phoneNumber: string): boolean {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    return formatted.startsWith("+62") && formatted.length >= 10;
  } catch {
    return false;
  }
}
