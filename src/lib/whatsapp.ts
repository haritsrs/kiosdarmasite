/**
 * WhatsApp utilities: Deep-link generation for marketplace orders
 * Generates WhatsApp click-to-chat links with pre-filled order messages
 */

import { type MarketplaceOrderItem } from "~/models/marketplace";
import { formatCurrency } from "./format";

export interface GenerateOrderLinkOptions {
  phoneNumber: string;
  items: MarketplaceOrderItem[];
  subtotal: number;
  storeName: string;
  orderId?: string;
  customerName?: string;
}

/**
 * Generate WhatsApp deep-link with pre-filled order message
 * @param options - Order details for message
 * @returns WhatsApp click-to-chat URL
 * @throws Error if phone number is invalid
 */
export function generateOrderLink(options: GenerateOrderLinkOptions): string {
  const { phoneNumber, items, subtotal, storeName, orderId, customerName } = options;

  // Validate and format phone number
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  if (!cleanPhone.startsWith("+62") && !cleanPhone.startsWith("62") && !cleanPhone.startsWith("0")) {
    throw new Error("Nomor WhatsApp tidak valid");
  }

  // Convert to E.164 format
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+" + formattedPhone;
  }

  const message = generateOrderMessage({
    items,
    subtotal,
    storeName,
    orderId,
    customerName,
  });

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodedMessage}`;
}

/**
 * Generate formatted order message for WhatsApp
 * @param options - Order details
 * @returns Formatted message string ready for WhatsApp
 */
export function generateOrderMessage(
  options: Omit<GenerateOrderLinkOptions, "phoneNumber">
): string {
  const { items, subtotal, storeName, orderId, customerName } = options;

  // Header
  let message = `Pesanan dari ${storeName}`;
  if (customerName) {
    message += ` - ${customerName}`;
  }
  if (orderId) {
    message += `\nNo. Pesanan: ${orderId}`;
  }
  message += "\n\n";

  // Item details
  const itemLines = items
    .map((item) => `${item.quantity}x ${item.productName} - ${formatCurrency(item.subtotal)}`)
    .join("\n");

  message += itemLines;

  // Total
  message += `\n\nTotal: ${formatCurrency(subtotal)}`;

  // Footer
  message += "\n\nTerima kasih!";

  return message;
}

/**
 * Generate WhatsApp status inquiry link
 * For customer to check order status
 */
export function generateOrderStatusLink(phoneNumber: string, orderId: string): string {
  // Validate and format phone number
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  if (!cleanPhone.startsWith("+62") && !cleanPhone.startsWith("62") && !cleanPhone.startsWith("0")) {
    throw new Error("Nomor WhatsApp tidak valid");
  }

  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+" + formattedPhone;
  }

  const message = encodeURIComponent(
    `Halo, saya ingin menanyakan status pesanan dengan nomor: ${orderId}`
  );

  return `https://wa.me/${formattedPhone.replace("+", "")}?text=${message}`;
}
