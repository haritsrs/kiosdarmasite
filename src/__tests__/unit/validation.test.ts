import { describe, it, expect } from "vitest";
import { contactFormSchema, signUpSchema } from "~/lib/validation";

describe("Validation Schemas", () => {
  describe("contactFormSchema", () => {
    it("should validate correct contact form data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "This is a test message with enough characters",
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        subject: "Test Subject",
        message: "This is a test message",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject message that is too short", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "Short",
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("signUpSchema", () => {
    it("should validate correct sign up data", () => {
      const validData = {
        email: "user@example.com",
        password: "Password123",
        name: "John Doe",
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject weak password", () => {
      const invalidData = {
        email: "user@example.com",
        password: "weak",
        name: "John Doe",
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});


