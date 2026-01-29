import { z } from "zod";

// ============================================================================
// CONTACT FORM SCHEMAS
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama terlalu panjang")
    .regex(/^[a-zA-Z0-9\s\u00C0-\u017F.,'-]+$/, "Nama mengandung karakter tidak valid"),
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang")
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(1, "Subjek harus diisi")
    .max(200, "Subjek terlalu panjang")
    .trim(),
  message: z
    .string()
    .min(10, "Pesan terlalu pendek (minimal 10 karakter)")
    .max(5000, "Pesan terlalu panjang (maksimal 5000 karakter)")
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Auth validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password terlalu panjang")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar")
    .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
  name: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama terlalu panjang")
    .trim(),
  role: z.enum(["customer", "merchant", "admin"]).optional().default("customer"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password harus diisi"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),
});

// Product validation (for merchant/admin)
export const productSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().max(50).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  currency: z.string().max(10).optional().default("IDR"),
});

// Order validation
export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1).max(120),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  subtotal: z.number().min(0),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Minimal 1 item diperlukan"),
  merchantId: z.string().min(1),
  merchantName: z.string().min(1),
  merchantPhone: z.string().min(1),
});

// ============================================================================
// MARKETPLACE SCHEMAS (POS Integration)
// ============================================================================

/**
 * Get marketplace stores with optional filters
 */
export const getStoresInputSchema = z.object({
  category: z.enum(["Makanan", "Minuman", "Kopi", "Lainnya"]).optional(),
  tags: z.array(z.string()).optional(),
});

export type GetStoresInput = z.infer<typeof getStoresInputSchema>;

/**
 * Marketplace order item
 */
export const marketplaceOrderItemSchema = z.object({
  productId: z.string().min(1, "ID produk diperlukan"),
  productName: z.string().min(1, "Nama produk diperlukan").max(120),
  quantity: z.number().int().min(1, "Kuantitas minimal 1"),
  unitPrice: z.number().min(0, "Harga tidak boleh negatif"),
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif"),
});

export type MarketplaceOrderItemInput = z.infer<typeof marketplaceOrderItemSchema>;

/**
 * Create marketplace order
 */
export const createMarketplaceOrderSchema = z.object({
  storeId: z.string().min(1, "ID toko diperlukan"),
  userId: z.string().min(1, "ID pengguna diperlukan"),
  items: z.array(marketplaceOrderItemSchema).min(1, "Minimal 1 item diperlukan"),
  subtotal: z.number().min(0, "Subtotal tidak boleh negatif"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  customerName: z.string().min(1, "Nama pelanggan diperlukan").max(100),
  customerPhone: z
    .string()
    .min(1, "Nomor WhatsApp diperlukan")
    .regex(/^[\d+\-\(\)\s]+$/, "Format nomor WhatsApp tidak valid"),
});

export type CreateMarketplaceOrderInput = z.infer<typeof createMarketplaceOrderSchema>;

/**
 * Update order status
 */
export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "ID pesanan diperlukan"),
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "expired"], {
    errorMap: () => ({ message: "Status pesanan tidak valid" }),
  }),
  reason: z.string().max(500, "Alasan maksimal 500 karakter").optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;


