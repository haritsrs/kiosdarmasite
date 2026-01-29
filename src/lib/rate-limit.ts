import { type NextRequest } from "next/server";

// Simple in-memory rate limiter for development
// For production, use @upstash/ratelimit with Redis/Upstash
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (request: NextRequest, identifier: string): { success: boolean; limit: number; remaining: number; reset: number } => {
      const key = `${identifier}:${options.interval}`;
      const now = Date.now();
      const windowStart = now - (now % options.interval);

      // Clean up old entries (simple cleanup, in production use TTL)
      if (store[key] && store[key]!.resetAt < now) {
        delete store[key];
      }

      if (!store[key]) {
        store[key] = {
          count: 1,
          resetAt: windowStart + options.interval,
        };
        return {
          success: true,
          limit: options.uniqueTokenPerInterval,
          remaining: options.uniqueTokenPerInterval - 1,
          reset: store[key]!.resetAt,
        };
      }

      if (store[key]!.count >= options.uniqueTokenPerInterval) {
        return {
          success: false,
          limit: options.uniqueTokenPerInterval,
          remaining: 0,
          reset: store[key]!.resetAt,
        };
      }

      store[key]!.count += 1;
      return {
        success: true,
        limit: options.uniqueTokenPerInterval,
        remaining: options.uniqueTokenPerInterval - store[key]!.count,
        reset: store[key]!.resetAt,
      };
    },
  };
}

// Pre-configured rate limiters
export const contactFormLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 5, // 5 requests per minute
});

export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 requests per 15 minutes
});

export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
});

// Get client identifier (IP address)
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  
  // Fallback to a default identifier
  return "unknown";
}

