/**
 * Vercel KV helpers for session management, rate limiting, and caching
 */

import { kv } from "@vercel/kv";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

/**
 * Rate limiting implementation using Vercel KV
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param limit - Maximum requests allowed (default: 10)
 * @param window - Time window in milliseconds (default: 1 minute)
 * @returns Boolean indicating if request is allowed
 */
export async function rateLimit(
  identifier: string,
  limit: number = MAX_REQUESTS_PER_WINDOW,
  window: number = RATE_LIMIT_WINDOW
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window;

  try {
    // Get current count and timestamp
    const data = await kv.get<{ count: number; windowStart: number }>(key);
    
    if (!data || data.windowStart < windowStart) {
      // Start new window
      await kv.set(key, { count: 1, windowStart: now }, { ex: Math.ceil(window / 1000) });
      return { allowed: true, remaining: limit - 1, resetTime: now + window };
    }
    
    if (data.count >= limit) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: data.windowStart + window };
    }
    
    // Increment counter
    const newCount = data.count + 1;
    await kv.set(key, { count: newCount, windowStart: data.windowStart }, { ex: Math.ceil(window / 1000) });
    
    return { 
      allowed: true, 
      remaining: limit - newCount, 
      resetTime: data.windowStart + window 
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Allow request on error to prevent blocking legitimate traffic
    return { allowed: true, remaining: limit - 1, resetTime: now + window };
  }
}

/**
 * Store booking session data temporarily
 * @param sessionId - Unique session identifier
 * @param data - Booking form data to store
 * @param ttl - Time to live in seconds (default: 30 minutes)
 */
export async function setBookingSession<T extends Record<string, unknown>>(
  sessionId: string,
  data: T,
  ttl: number = 1800
): Promise<void> {
  const key = `booking_session:${sessionId}`;
  await kv.set(key, data, { ex: ttl });
}

/**
 * Retrieve booking session data
 * @param sessionId - Session identifier
 * @returns Stored session data or null
 */
export async function getBookingSession<T extends Record<string, unknown>>(
  sessionId: string
): Promise<T | null> {
  const key = `booking_session:${sessionId}`;
  return await kv.get<T>(key);
}

/**
 * Clear booking session data
 * @param sessionId - Session identifier
 */
export async function clearBookingSession(sessionId: string): Promise<void> {
  const key = `booking_session:${sessionId}`;
  await kv.del(key);
}

/**
 * Store upload token for secure file uploads
 * @param token - Unique upload token
 * @param metadata - Associated metadata (booking ID, etc.)
 * @param ttl - Time to live in seconds (default: 1 hour)
 */
export async function setUploadToken(
  token: string,
  metadata: { bookingId: number; allowedTypes: string[] },
  ttl: number = 3600
): Promise<void> {
  const key = `upload_token:${token}`;
  await kv.set(key, metadata, { ex: ttl });
}

/**
 * Verify and consume upload token
 * @param token - Upload token to verify
 * @returns Token metadata or null if invalid
 */
export async function verifyUploadToken(
  token: string
): Promise<{ bookingId: number; allowedTypes: string[] } | null> {
  const key = `upload_token:${token}`;
  const metadata = await kv.get<{ bookingId: number; allowedTypes: string[] }>(key);
  
  if (metadata) {
    // Delete token after verification (single use)
    await kv.del(key);
  }
  
  return metadata;
}

/**
 * Cache availability data temporarily
 * @param brandSlug - Brand identifier
 * @param date - Date string (YYYY-MM-DD)
 * @param availability - Available time slots
 * @param ttl - Cache duration in seconds (default: 5 minutes)
 */
export async function cacheAvailability(
  brandSlug: string,
  date: string,
  availability: string[],
  ttl: number = 300
): Promise<void> {
  const key = `availability:${brandSlug}:${date}`;
  await kv.set(key, availability, { ex: ttl });
}

/**
 * Get cached availability data
 * @param brandSlug - Brand identifier
 * @param date - Date string (YYYY-MM-DD)
 * @returns Cached availability or null
 */
export async function getCachedAvailability(
  brandSlug: string,
  date: string
): Promise<string[] | null> {
  const key = `availability:${brandSlug}:${date}`;
  return await kv.get<string[]>(key);
}
