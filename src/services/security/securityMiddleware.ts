/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Security & Engineering Hardening Middleware:
 * 1. Strict Server-side Secret Protection (no secrets exposed)
 * 2. Multi-tier IP-based Rate Limiting (protecting paid AI calls)
 * 3. Daily & Hourly AI Billing Caps & Budget Circuit Breaker
 * 4. Parameterized Input Sanitization & Injection Prevention
 * 5. Enterprise HTTP Security Headers
 */

import { Request, Response, NextFunction } from "express";

// -------------------------------------------------------------
// 1. Enterprise Security Headers
// -------------------------------------------------------------
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Clickjacking protection (permit framing only from same origin)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Cross-site scripting (XSS) filter
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Referrer privacy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Restrict unneeded browser hardware features
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // Strip server implementation details
  res.removeHeader("X-Powered-By");

  next();
}

// -------------------------------------------------------------
// 2. Multi-Tier Rate Limiting (Sliding Window Algorithm)
// -------------------------------------------------------------
interface ClientWindowRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private name: string;
  private clientMap = new Map<string, ClientWindowRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(name: string, windowMs: number, maxRequests: number) {
    this.name = name;
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Prune stale entries every 5 minutes to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanupStale(), 5 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "unknown-ip";
  }

  private cleanupStale() {
    const now = Date.now();
    for (const [ip, record] of this.clientMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < this.windowMs);
      if (record.timestamps.length === 0) {
        this.clientMap.delete(ip);
      }
    }
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = this.getClientIp(req);
      const now = Date.now();
      const cutoff = now - this.windowMs;

      let clientRecord = this.clientMap.get(ip);
      if (!clientRecord) {
        clientRecord = { timestamps: [] };
        this.clientMap.set(ip, clientRecord);
      }

      // Filter to keep only requests within the sliding window
      clientRecord.timestamps = clientRecord.timestamps.filter((ts) => ts > cutoff);

      const count = clientRecord.timestamps.length;
      const remaining = Math.max(0, this.maxRequests - count);
      const oldestTimestamp = clientRecord.timestamps[0] || now;
      const resetTimeSeconds = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);

      // Set standard RFC rate-limiting headers
      res.setHeader("X-RateLimit-Limit", this.maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Math.max(0, resetTimeSeconds));

      if (count >= this.maxRequests) {
        res.setHeader("Retry-After", resetTimeSeconds);
        console.warn(`[Security Alert] Rate limit exceeded for ${this.name} by IP ${ip}. Requests in window: ${count}/${this.maxRequests}`);
        return res.status(429).json({
          error: `Rate limit reached for ${this.name}. You have made ${count} requests in the last ${Math.round(this.windowMs / 60000)} minutes. Please wait ${resetTimeSeconds} seconds before trying again.`,
          retryAfter: resetTimeSeconds,
          policy: {
            limit: this.maxRequests,
            windowMinutes: Math.round(this.windowMs / 60000),
          },
        });
      }

      // Record this valid request
      clientRecord.timestamps.push(now);
      next();
    };
  }
}

// Specific rate limit tiers by compute and cost profile
// Tier 1: Asset generation (highest cost per call - image generation)
export const assetGenRateLimiter = new SlidingWindowRateLimiter(
  "Asset Generation (AI Image)",
  15 * 60 * 1000, // 15 minutes
  12 // 12 requests per 15 minutes per IP
).middleware();

// Tier 2: Deep ASO Audits & Image Analysis (heavy reasoning models)
export const auditRateLimiter = new SlidingWindowRateLimiter(
  "ASO Listing Audit",
  15 * 60 * 1000, // 15 minutes
  30 // 30 deep audits per 15 minutes per IP
).middleware();

// Tier 3: Interactive Chat & Search Trends (text conversational calls)
export const chatRateLimiter = new SlidingWindowRateLimiter(
  "Interactive ASO Advisor",
  15 * 60 * 1000, // 15 minutes
  60 // 60 messages per 15 minutes per IP
).middleware();

// Tier 4: Store Data Inspect / Scrape
export const inspectRateLimiter = new SlidingWindowRateLimiter(
  "Play Store Listing Inspection",
  15 * 60 * 1000, // 15 minutes
  50 // 50 inspections per 15 minutes per IP
).middleware();


// -------------------------------------------------------------
// 3. Billing Cap Safeguards & Circuit Breaker
// -------------------------------------------------------------
interface BillingBudgetStats {
  hourlyLimit: number;
  dailyLimit: number;
  hourlyCount: number;
  dailyCount: number;
  circuitBreakerActive: boolean;
  lastResetHour: number;
  lastResetDay: number;
}

class BillingProtectionCircuitBreaker {
  private hourlyLimit: number;
  private dailyLimit: number;
  private hourlyCount = 0;
  private dailyCount = 0;
  private currentHour: number;
  private currentDay: number;

  constructor(hourlyLimit = 400, dailyLimit = 3500) {
    this.hourlyLimit = hourlyLimit;
    this.dailyLimit = dailyLimit;
    const now = new Date();
    this.currentHour = now.getUTCHours();
    this.currentDay = now.getUTCDate();
  }

  private checkRollingWindows() {
    const now = new Date();
    const nowHour = now.getUTCHours();
    const nowDay = now.getUTCDate();

    if (nowHour !== this.currentHour) {
      this.hourlyCount = 0;
      this.currentHour = nowHour;
    }

    if (nowDay !== this.currentDay) {
      this.dailyCount = 0;
      this.currentDay = nowDay;
    }
  }

  public recordAICall(costWeight = 1): boolean {
    this.checkRollingWindows();

    if (this.hourlyCount + costWeight > this.hourlyLimit) {
      console.error(`[Billing Cap Exceeded] Hourly AI call cap reached (${this.hourlyCount}/${this.hourlyLimit}). Circuit breaker tripped.`);
      return false;
    }

    if (this.dailyCount + costWeight > this.dailyLimit) {
      console.error(`[Billing Cap Exceeded] Daily AI call cap reached (${this.dailyCount}/${this.dailyLimit}). Circuit breaker tripped.`);
      return false;
    }

    this.hourlyCount += costWeight;
    this.dailyCount += costWeight;

    // Log warning when approaching 85% of caps
    if (this.hourlyCount > this.hourlyLimit * 0.85) {
      console.warn(`[Billing Alert] AI consumption at 85%+ of hourly budget cap: ${this.hourlyCount}/${this.hourlyLimit}`);
    }

    return true;
  }

  public isBreakerTripped(): boolean {
    this.checkRollingWindows();
    return this.hourlyCount >= this.hourlyLimit || this.dailyCount >= this.dailyLimit;
  }

  public getStatus(): BillingBudgetStats {
    this.checkRollingWindows();
    return {
      hourlyLimit: this.hourlyLimit,
      dailyLimit: this.dailyLimit,
      hourlyCount: this.hourlyCount,
      dailyCount: this.dailyCount,
      circuitBreakerActive: this.isBreakerTripped(),
      lastResetHour: this.currentHour,
      lastResetDay: this.currentDay,
    };
  }
}

export const billingCircuitBreaker = new BillingProtectionCircuitBreaker(400, 3500);

// Middleware to enforce billing cap prior to executing any paid API operation
export function billingCapGuard(costWeight = 1) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!billingCircuitBreaker.recordAICall(costWeight)) {
      return res.status(429).json({
        error: "Billing safeguard circuit breaker active: Hourly AI quota protection limit reached. Service has paused paid AI calls to protect against cost overruns.",
        circuitBreaker: true,
        stats: billingCircuitBreaker.getStatus(),
      });
    }
    next();
  };
}


// -------------------------------------------------------------
// 4. Parameterized Input Sanitization & Validation (Anti-Injection)
// -------------------------------------------------------------

// Regex for safe ISO country code (2 letters)
const COUNTRY_CODE_REGEX = /^[a-zA-Z]{2}$/;

// Regex for safe language code (e.g. en, pt-BR, es-419)
const LANG_CODE_REGEX = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})?$/;

// Android Package ID Regex
const PACKAGE_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)+$/;

export function sanitizeString(input: unknown, maxLength = 2000): string {
  if (typeof input !== "string") return "";
  // Strip null bytes and dangerous control characters
  return input
    .replace(/\0/g, "")
    .replace(/[\u0001-\u0008\u000B-\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function validateAuditInput(req: Request, res: Response, next: NextFunction) {
  const { url, country, lang } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid Google Play Store URL or package ID string is required." });
  }

  const cleanUrl = url.trim();
  if (cleanUrl.length > 500) {
    return res.status(400).json({ error: "Input URL or package identifier exceeds maximum allowed length (500 chars)." });
  }

  // Validate country parameter if provided
  if (country && (typeof country !== "string" || !COUNTRY_CODE_REGEX.test(country.trim()))) {
    return res.status(400).json({ error: "Invalid country code format. Expected 2-letter ISO code (e.g. 'us', 'gb', 'de')." });
  }

  // Validate lang parameter if provided
  if (lang && (typeof lang !== "string" || !LANG_CODE_REGEX.test(lang.trim()))) {
    return res.status(400).json({ error: "Invalid language code format. Expected standard language tag (e.g. 'en', 'es', 'pt-BR')." });
  }

  // Sanitize values in body
  req.body.url = cleanUrl;
  req.body.country = country ? country.trim().toLowerCase() : "us";
  req.body.lang = lang ? lang.trim().toLowerCase() : "en";

  next();
}

export function validateChatInput(req: Request, res: Response, next: NextFunction) {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message string is required." });
  }

  const sanitized = sanitizeString(message, 3000);
  if (!sanitized) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  req.body.message = sanitized;
  next();
}

export function validateImageAnalysisInput(req: Request, res: Response, next: NextFunction) {
  const { imageBase64, mimeType, prompt } = req.body;

  if (!imageBase64 || typeof imageBase64 !== "string") {
    return res.status(400).json({ error: "Valid base64 image data string is required." });
  }

  // Check base64 size (max ~10MB)
  if (imageBase64.length > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "Image payload exceeds maximum allowed size (10MB)." });
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const sanitizedMime = typeof mimeType === "string" ? mimeType.trim().toLowerCase() : "image/png";
  if (!allowedMimeTypes.includes(sanitizedMime)) {
    return res.status(400).json({ error: `Unsupported image MIME type: ${sanitizedMime}. Supported: ${allowedMimeTypes.join(", ")}` });
  }

  req.body.mimeType = sanitizedMime;
  req.body.prompt = prompt ? sanitizeString(prompt, 1000) : undefined;

  next();
}

export function validateAssetGenInput(req: Request, res: Response, next: NextFunction) {
  const { prompt, imageSize, aspectRatio } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt string is required for asset generation." });
  }

  const sanitizedPrompt = sanitizeString(prompt, 1000);
  if (!sanitizedPrompt) {
    return res.status(400).json({ error: "Prompt cannot be empty." });
  }

  const allowedAspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
  const allowedSizes = ["1K", "2K"];

  req.body.prompt = sanitizedPrompt;
  req.body.aspectRatio = allowedAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";
  req.body.imageSize = allowedSizes.includes(imageSize) ? imageSize : "1K";

  next();
}
