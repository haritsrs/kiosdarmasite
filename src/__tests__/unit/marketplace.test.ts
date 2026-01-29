/**
 * Unit tests for marketplace utilities
 */

import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatTime,
  formatPhoneNumber,
  isValidWhatsappPhone,
} from "~/lib/format";
import {
  generateOrderLink,
  generateOrderMessage,
  generateOrderStatusLink,
} from "~/lib/whatsapp";
import { type MarketplaceOrderItem } from "~/models/marketplace";

describe("Format Utilities", () => {
  describe("formatCurrency", () => {
    it("should format number as IDR", () => {
      expect(formatCurrency(15000)).toMatch(/Rp/);
      expect(formatCurrency(15000)).toContain("15");
    });

    it("should format zero correctly", () => {
      expect(formatCurrency(0)).toMatch(/Rp/);
    });

    it("should format large numbers", () => {
      const result = formatCurrency(1500000);
      expect(result).toMatch(/Rp/);
      expect(result).toContain("1");
    });
  });

  describe("formatDate", () => {
    it("should format date with time", () => {
      const date = new Date("2025-01-24T14:30:00Z");
      const result = formatDate(date);
      expect(result).toContain("24");
      expect(result).toContain("14");
      expect(result).toContain("30");
    });

    it("should handle ISO string input", () => {
      const result = formatDate("2025-01-24T14:30:00Z");
      expect(result).toContain("24");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should convert 0 prefix to +62", () => {
      expect(formatPhoneNumber("08123456789")).toBe("+628123456789");
    });

    it("should add + to 62 prefix", () => {
      expect(formatPhoneNumber("628123456789")).toBe("+628123456789");
    });

    it("should handle +62 prefix", () => {
      expect(formatPhoneNumber("+628123456789")).toBe("+628123456789");
    });

    it("should remove formatting characters", () => {
      expect(formatPhoneNumber("0812-3456-789")).toBe("+628123456789");
      expect(formatPhoneNumber("(0812) 3456-789")).toBe("+628123456789");
    });

    it("should throw error on invalid format", () => {
      expect(() => formatPhoneNumber("123")).toThrow();
    });
  });

  describe("isValidWhatsappPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidWhatsappPhone("08123456789")).toBe(true);
      expect(isValidWhatsappPhone("+628123456789")).toBe(true);
      expect(isValidWhatsappPhone("628123456789")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidWhatsappPhone("123")).toBe(false);
      expect(isValidWhatsappPhone("invalid")).toBe(false);
      expect(isValidWhatsappPhone("")).toBe(false);
    });
  });
});

describe("WhatsApp Utilities", () => {
  const mockItems: MarketplaceOrderItem[] = [
    {
      productId: "prod1",
      productName: "Paket Hemat 1",
      quantity: 2,
      unitPrice: 15000,
      subtotal: 30000,
    },
    {
      productId: "prod2",
      productName: "Ayam Bakar",
      quantity: 1,
      unitPrice: 18000,
      subtotal: 18000,
    },
  ];

  describe("generateOrderMessage", () => {
    it("should generate formatted message", () => {
      const message = generateOrderMessage({
        items: mockItems,
        subtotal: 48000,
        storeName: "Ayam Bakar Solo",
      });

      expect(message).toContain("Ayam Bakar Solo");
      expect(message).toContain("Paket Hemat 1");
      expect(message).toContain("Ayam Bakar");
      expect(message).toContain("2x");
      expect(message).toContain("1x");
      expect(message).toContain("Rp");
      expect(message).toContain("Terima kasih");
    });

    it("should include order ID if provided", () => {
      const message = generateOrderMessage({
        items: mockItems,
        subtotal: 48000,
        storeName: "Ayam Bakar Solo",
        orderId: "ORDER123",
      });

      expect(message).toContain("ORDER123");
    });

    it("should include customer name if provided", () => {
      const message = generateOrderMessage({
        items: mockItems,
        subtotal: 48000,
        storeName: "Ayam Bakar Solo",
        customerName: "Budi",
      });

      expect(message).toContain("Budi");
    });
  });

  describe("generateOrderLink", () => {
    it("should generate valid WhatsApp link", () => {
      const link = generateOrderLink({
        phoneNumber: "08123456789",
        items: mockItems,
        subtotal: 48000,
        storeName: "Ayam Bakar Solo",
      });

      expect(link).toContain("https://wa.me/");
      expect(link).toContain("628123456789");
      expect(link).toContain("text=");
    });

    it("should encode message properly", () => {
      const link = generateOrderLink({
        phoneNumber: "08123456789",
        items: mockItems,
        subtotal: 48000,
        storeName: "Ayam Bakar Solo",
      });

      expect(link).toContain("%");
      expect(decodeURIComponent(link)).toContain("Ayam Bakar Solo");
    });

    it("should throw on invalid phone", () => {
      expect(() =>
        generateOrderLink({
          phoneNumber: "invalid",
          items: mockItems,
          subtotal: 48000,
          storeName: "Ayam Bakar Solo",
        })
      ).toThrow();
    });

    it("should handle different phone formats", () => {
      const formats = [
        "08123456789",
        "+628123456789",
        "628123456789",
        "0812-3456-789",
        "(0812) 3456-789",
      ];

      for (const phone of formats) {
        const link = generateOrderLink({
          phoneNumber: phone,
          items: mockItems,
          subtotal: 48000,
          storeName: "Ayam Bakar Solo",
        });

        expect(link).toContain("wa.me");
      }
    });
  });

  describe("generateOrderStatusLink", () => {
    it("should generate status inquiry link", () => {
      const link = generateOrderStatusLink("08123456789", "ORDER123");

      expect(link).toContain("https://wa.me/");
      expect(link).toContain("628123456789");
      expect(link).toContain("ORDER123");
    });

    it("should throw on invalid phone", () => {
      expect(() => generateOrderStatusLink("invalid", "ORDER123")).toThrow();
    });
  });
});
