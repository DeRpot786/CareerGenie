// ============================================================
// CAREER GENIE — Gemini Multi-Key Failover & Rotation Manager
// Handles automatic key rotation, rate-limit cooldowns,
// exponential backoff with jitter, and secure key isolation.
// ============================================================

/**
 * Default cooldown duration for a key that encountered HTTP 429 / RESOURCE_EXHAUSTED
 */
const DEFAULT_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_KEY_ATTEMPTS = 3; // Maximum key attempts per individual request

// Known placeholder strings to ignore
const PLACEHOLDER_STRINGS = new Set([
  'your_first_api_key',
  'your_second_api_key',
  'your_third_api_key',
  'your_first_gemini_api_key_here',
  'your_second_gemini_api_key_here',
  'your_third_gemini_api_key_here',
  'your_gemini_api_key_here',
  'your_openai_api_key_here',
  'your_gemini_or_openai_api_key_here'
]);

class GeminiKeyManager {
  constructor() {
    this.keys = [];
    this.activeKeyIndex = 0;
    this.initialized = false;
    this.reloadKeys();
  }

  /**
   * Safe string masking for logging (never leaks full keys)
   * Example: "AIzaSy...4aBg"
   */
  static maskKey(key) {
    if (!key || typeof key !== 'string') return '[empty]';
    const trimmed = key.trim();
    if (trimmed.length <= 8) return '***';
    return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
  }

  /**
   * Discover and load all configured Gemini API keys from environment
   * Supports GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3
   * with backward-compatible fallback to GEMINI_API_KEY or AI_API_KEY.
   */
  reloadKeys() {
    const rawKeys = [];

    // 1. Primary: Check GEMINI_API_KEY_1, 2, 3
    const key1 = process.env.GEMINI_API_KEY_1;
    const key2 = process.env.GEMINI_API_KEY_2;
    const key3 = process.env.GEMINI_API_KEY_3;

    if (this.isValidKeyCandidate(key1)) {
      rawKeys.push({ envVar: 'GEMINI_API_KEY_1', key: key1.trim(), name: 'Key #1' });
    }
    if (this.isValidKeyCandidate(key2)) {
      rawKeys.push({ envVar: 'GEMINI_API_KEY_2', key: key2.trim(), name: 'Key #2' });
    }
    if (this.isValidKeyCandidate(key3)) {
      rawKeys.push({ envVar: 'GEMINI_API_KEY_3', key: key3.trim(), name: 'Key #3' });
    }

    // 2. Backward compatibility fallback: If Key 1 is not configured, check GEMINI_API_KEY or AI_API_KEY
    if (rawKeys.length === 0) {
      const fallbackKey = process.env.GEMINI_API_KEY || (process.env.AI_PROVIDER === 'gemini' ? process.env.AI_API_KEY : null);
      if (this.isValidKeyCandidate(fallbackKey)) {
        rawKeys.push({ envVar: 'GEMINI_API_KEY', key: fallbackKey.trim(), name: 'Key #1 (Fallback)' });
      }
    }

    // Preserve existing cooldown and stats if key string matches
    const existingMap = new Map((this.keys || []).map(k => [k.key, k]));

    this.keys = rawKeys.map((item, index) => {
      const existing = existingMap.get(item.key);
      return {
        id: index + 1,
        name: item.name,
        envVar: item.envVar,
        key: item.key,
        status: existing ? existing.status : 'HEALTHY', // 'HEALTHY' | 'COOLDOWN' | 'INVALID'
        cooldownUntil: existing ? existing.cooldownUntil : 0,
        consecutiveErrors: existing ? existing.consecutiveErrors : 0,
        totalSuccess: existing ? existing.totalSuccess : 0,
        totalRateLimits: existing ? existing.totalRateLimits : 0,
        lastUsedAt: existing ? existing.lastUsedAt : 0,
        lastError: existing ? existing.lastError : null
      };
    });

    if (this.activeKeyIndex >= this.keys.length) {
      this.activeKeyIndex = 0;
    }

    this.initialized = true;
    return this.keys;
  }

  isValidKeyCandidate(val) {
    if (!val || typeof val !== 'string') return false;
    const trimmed = val.trim();
    if (trimmed.length < 8) return false;
    if (PLACEHOLDER_STRINGS.has(trimmed)) return false;
    return true;
  }

  /**
   * Check if at least one valid Gemini key is configured
   */
  hasConfiguredKeys() {
    this.reloadKeys();
    return this.keys.length > 0;
  }

  /**
   * Log startup status without leaking secrets
   */
  validateStartupKeys() {
    this.reloadKeys();
    if (this.keys.length === 0) {
      console.warn('[Gemini Key Manager] No valid Gemini API keys configured. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3.');
      return false;
    }

    const summaries = this.keys.map(k => `${k.name} (${k.envVar})`);
    console.log(`[Gemini Key Manager] Initialized with ${this.keys.length} Gemini API key(s): ${summaries.join(', ')}. Automatic failover & rate-limit rotation enabled.`);
    return true;
  }

  /**
   * Select the next available key for a request attempt, taking into account
   * cooldowns and already attempted keys.
   */
  selectAvailableKey(attemptedKeyIds = new Set()) {
    const now = Date.now();
    if (this.keys.length === 0) {
      return null;
    }

    // Recover expired cooldowns
    for (const key of this.keys) {
      if (key.status === 'COOLDOWN' && now >= key.cooldownUntil) {
        key.status = 'HEALTHY';
        key.cooldownUntil = 0;
        key.lastError = null;
      }
    }

    // 1. Try healthy keys starting from activeKeyIndex
    const total = this.keys.length;
    for (let i = 0; i < total; i++) {
      const idx = (this.activeKeyIndex + i) % total;
      const keyObj = this.keys[idx];
      if (keyObj.status === 'HEALTHY' && !attemptedKeyIds.has(keyObj.id)) {
        return keyObj;
      }
    }

    // 2. If no healthy unattempted keys, check if any unattempted key has an expired or nearly expired cooldown
    let earliestCooldownKey = null;
    let minCooldownUntil = Infinity;

    for (let i = 0; i < total; i++) {
      const idx = (this.activeKeyIndex + i) % total;
      const keyObj = this.keys[idx];
      if (keyObj.status !== 'INVALID' && !attemptedKeyIds.has(keyObj.id)) {
        if (keyObj.cooldownUntil < minCooldownUntil) {
          minCooldownUntil = keyObj.cooldownUntil;
          earliestCooldownKey = keyObj;
        }
      }
    }

    return earliestCooldownKey;
  }

  /**
   * Parse Retry-After headers or Gemini error metadata to determine cooldown in ms
   */
  parseCooldownMs(err, headers) {
    // 1. Check standard HTTP Retry-After header
    if (headers && typeof headers.get === 'function') {
      const retryAfter = headers.get('retry-after');
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds) && seconds > 0) {
          return Math.min(seconds * 1000, 5 * 60 * 1000); // Cap at 5 minutes
        }
      }
    }

    // 2. Check for retryDelay or quota metadata in error details
    if (err && err.details) {
      const details = Array.isArray(err.details) ? err.details : [err.details];
      for (const d of details) {
        if (d?.retryDelay) {
          const match = /(\d+(?:\.\d+)?)s?/.exec(d.retryDelay);
          if (match) {
            const sec = parseFloat(match[1]);
            if (!isNaN(sec) && sec > 0) {
              return Math.min(Math.ceil(sec * 1000), 5 * 60 * 1000);
            }
          }
        }
      }
    }

    return DEFAULT_COOLDOWN_MS;
  }

  /**
   * Classify an error into:
   * - 'RATE_LIMIT': 429, RESOURCE_EXHAUSTED, quota exceeded
   * - 'INVALID_KEY': 400 API_KEY_INVALID, 401 Unauthorized, 403 API key disabled
   * - 'TRANSIENT': 500, 502, 503, 504, timeout, network disconnect
   * - 'PERMANENT_REQUEST_ERROR': 400 Bad Request, malformed prompt, safety filters
   */
  classifyError(err) {
    const status = err.status || (err.response ? err.response.status : null);
    const msg = (err.message || '').toLowerCase();
    const detailsStatus = (err.details && err.details.status) ? String(err.details.status).toLowerCase() : '';

    // Check for Rate Limit / Quota Exhaustion
    if (
      status === 429 ||
      detailsStatus.includes('resource_exhausted') ||
      msg.includes('429') ||
      msg.includes('resource_exhausted') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('too many requests')
    ) {
      return 'RATE_LIMIT';
    }

    // Check for Invalid / Unauthorized API Key
    if (
      (status === 400 && (msg.includes('api_key_invalid') || msg.includes('api key not valid'))) ||
      status === 401 ||
      (status === 403 && (msg.includes('api key') || msg.includes('permission_denied') || msg.includes('unauthorized')))
    ) {
      return 'INVALID_KEY';
    }

    // Check for Transient Server / Network Errors
    if (
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      err.name === 'AbortError' ||
      msg.includes('timeout') ||
      msg.includes('econnreset') ||
      msg.includes('etimedout') ||
      msg.includes('fetch failed') ||
      msg.includes('network')
    ) {
      return 'TRANSIENT';
    }

    // Non-retryable request error (prompt too long, syntax error in payload, etc.)
    return 'PERMANENT_REQUEST_ERROR';
  }

  /**
   * Sleep helper with jitter support
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  calculateBackoff(attempt, baseDelay = 100) {
    const exponential = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 50;
    return Math.min(Math.round(exponential + jitter), 1000);
  }

  /**
   * Execute an operation with automatic key rotation, rate-limit cooldown,
   * and failover across the configured Gemini API keys.
   *
   * @param {Function} operation - async ({ key, id, name }) => result
   * @returns {Promise<any>}
   */
  async executeWithFailover(operation) {
    if (!this.keys || this.keys.length === 0) {
      this.reloadKeys();
    }

    if (this.keys.length === 0) {
      const err = new Error('No valid Gemini API keys configured. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3.');
      err.status = 503;
      err.code = 'KEY_MISSING';
      throw err;
    }

    const attemptedKeyIds = new Set();
    const maxAttempts = Math.min(MAX_KEY_ATTEMPTS, this.keys.length);
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const keyObj = this.selectAvailableKey(attemptedKeyIds);

      if (!keyObj) {
        // No further keys available to attempt
        break;
      }

      attemptedKeyIds.add(keyObj.id);

      // If key is in cooldown, check if the cooldown is just a fraction of a second away
      const now = Date.now();
      if (keyObj.status === 'COOLDOWN' && keyObj.cooldownUntil > now) {
        const remainingMs = keyObj.cooldownUntil - now;
        if (remainingMs <= 600) {
          // Brief wait if cooldown is almost over
          await this.sleep(remainingMs);
          keyObj.status = 'HEALTHY';
          keyObj.cooldownUntil = 0;
        } else {
          // Key is still firmly in cooldown and no healthy keys exist
          lastError = new Error('All configured Gemini API keys are currently in cooldown.');
          lastError.status = 429;
          lastError.code = 'RATE_LIMITED';
          break;
        }
      }

      try {
        keyObj.lastUsedAt = Date.now();
        const result = await operation(keyObj);

        // Success! Mark key healthy and set as current active key
        keyObj.status = 'HEALTHY';
        keyObj.consecutiveErrors = 0;
        keyObj.cooldownUntil = 0;
        keyObj.totalSuccess++;

        // Keep activeKeyIndex at this successful key
        const foundIdx = this.keys.findIndex(k => k.id === keyObj.id);
        if (foundIdx !== -1) {
          this.activeKeyIndex = foundIdx;
        }

        return result;

      } catch (err) {
        lastError = err;
        keyObj.consecutiveErrors++;
        const classification = this.classifyError(err);

        if (classification === 'RATE_LIMIT') {
          const cooldownMs = this.parseCooldownMs(err, err.headers);
          keyObj.status = 'COOLDOWN';
          keyObj.cooldownUntil = Date.now() + cooldownMs;
          keyObj.totalRateLimits++;
          keyObj.lastError = 'Rate limited / Quota exhausted';

          console.warn(`[Gemini Failover] ${keyObj.name} hit rate limit/quota. Placed in cooldown for ${Math.round(cooldownMs / 1000)}s.`);

          // Advance activeKeyIndex to rotate immediately
          this.activeKeyIndex = (this.activeKeyIndex + 1) % this.keys.length;

          // If more attempts remain, backoff briefly and failover
          if (attempt < maxAttempts) {
            const backoffMs = this.calculateBackoff(attempt, 80);
            await this.sleep(backoffMs);
            continue;
          }

        } else if (classification === 'INVALID_KEY') {
          keyObj.status = 'INVALID';
          keyObj.lastError = 'Permanently invalid or unauthorized key';
          console.error(`[Gemini Failover] ${keyObj.name} is invalid or unauthorized. Disabling this key.`);

          // Advance activeKeyIndex
          this.activeKeyIndex = (this.activeKeyIndex + 1) % this.keys.length;

          if (attempt < maxAttempts) {
            continue;
          }

        } else if (classification === 'TRANSIENT') {
          console.warn(`[Gemini Failover] Transient failure on ${keyObj.name} (${err.message}).`);
          this.activeKeyIndex = (this.activeKeyIndex + 1) % this.keys.length;

          if (attempt < maxAttempts) {
            const backoffMs = this.calculateBackoff(attempt, 150);
            await this.sleep(backoffMs);
            continue;
          }

        } else {
          // Permanent request error (malformed request, prompt invalid, safety violation)
          // DO NOT retry other keys for client-side request flaws
          throw err;
        }
      }
    }

    // If loop finishes without success:
    const errorClassification = this.classifyError(lastError);
    if (errorClassification === 'RATE_LIMIT' || (lastError && lastError.code === 'RATE_LIMITED')) {
      // Calculate remaining cooldown across keys
      const minCooldownRemaining = Math.max(
        1,
        Math.ceil((Math.min(...this.keys.map(k => k.cooldownUntil || (Date.now() + DEFAULT_COOLDOWN_MS))) - Date.now()) / 1000)
      );

      const rateLimitErr = new Error(
        `All configured Gemini AI keys have temporarily reached their rate limit. Please try again in about ${minCooldownRemaining} seconds.`
      );
      rateLimitErr.status = 429;
      rateLimitErr.code = 'RATE_LIMITED';
      rateLimitErr.retryAfter = minCooldownRemaining;
      throw rateLimitErr;
    }

    if (errorClassification === 'INVALID_KEY') {
      const invalidErr = new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY_1, GEMINI_API_KEY_2, or GEMINI_API_KEY_3 configuration.');
      invalidErr.status = 401;
      invalidErr.code = 'INVALID_KEY';
      throw invalidErr;
    }

    // Rethrow last transient or general error
    throw lastError;
  }

  /**
   * Status summary for diagnostics and monitoring (zero secrets leaked)
   */
  getStatusSummary() {
    const now = Date.now();
    return {
      activeKeyIndex: this.activeKeyIndex,
      totalConfigured: this.keys.length,
      keys: this.keys.map(k => ({
        id: k.id,
        name: k.name,
        envVar: k.envVar,
        status: k.status,
        cooldownRemainingSec: k.cooldownUntil > now ? Math.ceil((k.cooldownUntil - now) / 1000) : 0,
        totalSuccess: k.totalSuccess,
        totalRateLimits: k.totalRateLimits,
        lastError: k.lastError
      }))
    };
  }

  /**
   * Reset internal state for automated testing
   */
  _resetForTesting(testKeys = null) {
    if (testKeys) {
      this.keys = testKeys.map((item, idx) => ({
        id: idx + 1,
        name: item.name || `Key #${idx + 1}`,
        envVar: item.envVar || `GEMINI_API_KEY_${idx + 1}`,
        key: item.key,
        status: item.status || 'HEALTHY',
        cooldownUntil: item.cooldownUntil || 0,
        consecutiveErrors: 0,
        totalSuccess: 0,
        totalRateLimits: 0,
        lastUsedAt: 0,
        lastError: null
      }));
    } else {
      this.keys = [];
      this.reloadKeys();
    }
    this.activeKeyIndex = 0;
  }
}

// Singleton instance
const geminiKeyManager = new GeminiKeyManager();

module.exports = {
  geminiKeyManager,
  GeminiKeyManager,
  DEFAULT_COOLDOWN_MS,
  MAX_KEY_ATTEMPTS
};
