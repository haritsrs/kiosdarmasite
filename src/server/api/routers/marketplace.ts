/**
 * tRPC Marketplace Router
 * Handles all marketplace operations: store listing, product browsing, order creation
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getStoresInputSchema,
  createMarketplaceOrderSchema,
  updateOrderStatusSchema,
} from "~/lib/validation";
import {
  getMarketplaceStores,
  getStoreProducts,
  createMarketplaceOrder,
  updateOrderStatus,
  markOrderWhatsappSent,
} from "~/services/firebase/marketplace";
import { type MarketplaceOrder, type MarketplaceOrderItem } from "~/models/marketplace";

export const marketplaceRouter = createTRPCRouter({
  /**
   * Get all marketplace stores with optional filters
   */
  getStores: publicProcedure
    .input(getStoresInputSchema)
    .query(async ({ input }) => {
      try {
        const stores = await getMarketplaceStores({
          category: input.category,
          tags: input.tags,
        });

        return {
          success: true,
          data: stores,
          count: stores.length,
        };
      } catch (error) {
        console.error("[marketplaceRouter.getStores] Error:", error);
        throw error;
      }
    }),

  /**
   * Get products from a specific store
   */
  getStoreProducts: publicProcedure
    .input(
      z.object({
        storeId: z.string().min(1, "Store ID diperlukan"),
      })
    )
    .query(async ({ input }) => {
      try {
        const products = await getStoreProducts(input.storeId);

        return {
          success: true,
          data: products,
          count: products.length,
        };
      } catch (error) {
        console.error("[marketplaceRouter.getStoreProducts] Error:", error);
        throw error;
      }
    }),

  /**
   * Create a marketplace order
   * This is public - customers don't need authentication
   */
  createOrder: publicProcedure
    .input(createMarketplaceOrderSchema)
    .mutation(async ({ input }) => {
      try {
        const { storeId, userId, items, subtotal, notes } = input;

        // Validate items match their subtotals (prevent tampering)
        const calculatedSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
          throw new Error("Subtotal tidak cocok dengan item yang dipilih");
        }

        // Create marketplace order
        const orderData: Omit<MarketplaceOrder, "orderId"> = {
          storeId,
          userId,
          items: items as MarketplaceOrderItem[],
          subtotal,
          status: "pending",
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          notes,
        };

        const orderId = await createMarketplaceOrder(orderData);

        return {
          success: true,
          orderId,
          message: `Pesanan berhasil dibuat. Nomor pesanan: ${orderId}`,
          redirectUrl: `/orders/${orderId}`,
        };
      } catch (error) {
        console.error("[marketplaceRouter.createOrder] Error:", error);
        throw error;
      }
    }),

  /**
   * Update order status (store or admin only, but we accept it for demo)
   */
  updateOrderStatus: publicProcedure
    .input(updateOrderStatusSchema)
    .mutation(async ({ input }) => {
      try {
        const { orderId, status, reason } = input;

        await updateOrderStatus(orderId, status, reason);

        return {
          success: true,
          message: `Status pesanan diperbarui menjadi: ${status}`,
        };
      } catch (error) {
        console.error("[marketplaceRouter.updateOrderStatus] Error:", error);
        throw error;
      }
    }),

  /**
   * Mark order as WhatsApp sent
   */
  markWhatsappSent: publicProcedure
    .input(
      z.object({
        orderId: z.string().min(1, "Order ID diperlukan"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await markOrderWhatsappSent(input.orderId);

        return {
          success: true,
          message: "WhatsApp pesanan telah dicatat",
        };
      } catch (error) {
        console.error("[marketplaceRouter.markWhatsappSent] Error:", error);
        throw error;
      }
    }),
});
