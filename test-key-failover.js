// ============================================================
// CAREER GENIE — Gemini 3-Key Failover & Rotation Test Suite
// Verifies all 7 required scenarios:
// 1. Key 1 succeeds.
// 2. Key 1 reaches rate limit and Key 2 succeeds.
// 3. Keys 1 and 2 fail and Key 3 succeeds.
// 4. All three keys fail (graceful 429 message, max 3 attempts).
// 5. Invalid API key is handled correctly (marked invalid, never retried).
// 6. Permanent error does not trigger unnecessary retries.
// 7. Multiple simultaneous requests do not cause uncontrolled retries.
// ============================================================

const { GeminiKeyManager } = require('./api/geminiKeyManager');

async function runFailoverTests() {
  console.log('🧪 Starting Gemini 3-Key Failover & Rotation Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  const sampleKeys = [
    { key: 'AIzaSyFakeKeyOne________________111', name: 'Key #1', envVar: 'GEMINI_API_KEY_1' },
    { key: 'AIzaSyFakeKeyTwo________________222', name: 'Key #2', envVar: 'GEMINI_API_KEY_2' },
    { key: 'AIzaSyFakeKeyThree______________333', name: 'Key #3', envVar: 'GEMINI_API_KEY_3' }
  ];

  // Helper to create rate limit error
  function makeRateLimitError() {
    const err = new Error('Resource has been exhausted (e.g. check quota).');
    err.status = 429;
    err.details = { status: 'RESOURCE_EXHAUSTED' };
    return err;
  }

  // Helper to create invalid key error
  function makeInvalidKeyError() {
    const err = new Error('API key not valid. Please pass a valid API key. [API_KEY_INVALID]');
    err.status = 400;
    return err;
  }

  // Helper to create permanent client-side error
  function makeBadRequestError() {
    const err = new Error('INVALID_ARGUMENT: Schema validation failed');
    err.status = 400;
    return err;
  }

  // Helper to create transient 503 error
  function makeTransientError() {
    const err = new Error('The service is temporarily unavailable');
    err.status = 503;
    return err;
  }

  // ------------------------------------------------------------
  // Scenario 1: Key 1 succeeds on first attempt
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    const result = await manager.executeWithFailover(async (keyObj) => {
      calls.push(keyObj.name);
      return { success: true, text: 'AI response from Key 1' };
    });

    const summary = manager.getStatusSummary();
    assert(result.success === true && result.text === 'AI response from Key 1', 'Scenario 1: Key 1 returns successful response');
    assert(calls.length === 1 && calls[0] === 'Key #1', 'Scenario 1: Only Key 1 was invoked');
    assert(summary.keys[0].totalSuccess === 1 && summary.keys[0].status === 'HEALTHY', 'Scenario 1: Key 1 recorded as healthy with 1 success');
    assert(summary.activeKeyIndex === 0, 'Scenario 1: Key 1 remains active key');
  }

  // ------------------------------------------------------------
  // Scenario 2: Key 1 reaches rate limit and Key 2 succeeds
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    const result = await manager.executeWithFailover(async (keyObj) => {
      calls.push(keyObj.name);
      if (keyObj.name === 'Key #1') {
        throw makeRateLimitError();
      }
      return { success: true, text: 'AI response from Key 2' };
    });

    const summary = manager.getStatusSummary();
    assert(result.success === true && result.text === 'AI response from Key 2', 'Scenario 2: Failover from Key 1 to Key 2 succeeded');
    assert(calls.length === 2 && calls[0] === 'Key #1' && calls[1] === 'Key #2', 'Scenario 2: Key 1 failed with 429, then Key 2 was called');
    assert(summary.keys[0].status === 'COOLDOWN' && summary.keys[0].totalRateLimits === 1, 'Scenario 2: Key 1 placed in cooldown');
    assert(summary.keys[1].status === 'HEALTHY' && summary.keys[1].totalSuccess === 1, 'Scenario 2: Key 2 marked healthy');
    assert(summary.activeKeyIndex === 1, 'Scenario 2: Active key rotated to Key 2 for subsequent requests');

    // Subsequent request should automatically start on Key 2 directly (skipping Key 1 in cooldown)
    const nextCalls = [];
    await manager.executeWithFailover(async (keyObj) => {
      nextCalls.push(keyObj.name);
      return { success: true };
    });
    assert(nextCalls.length === 1 && nextCalls[0] === 'Key #2', 'Scenario 2: Next request started directly on Key 2 without retrying Key 1');
  }

  // ------------------------------------------------------------
  // Scenario 3: Keys 1 and 2 fail (rate limits) and Key 3 succeeds
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    const result = await manager.executeWithFailover(async (keyObj) => {
      calls.push(keyObj.name);
      if (keyObj.name === 'Key #1' || keyObj.name === 'Key #2') {
        throw makeRateLimitError();
      }
      return { success: true, text: 'AI response from Key 3' };
    });

    const summary = manager.getStatusSummary();
    assert(result.success === true && result.text === 'AI response from Key 3', 'Scenario 3: Failover through Key 1 & 2 succeeded on Key 3');
    assert(calls.length === 3 && calls[0] === 'Key #1' && calls[1] === 'Key #2' && calls[2] === 'Key #3', 'Scenario 3: Checked Keys 1, 2, and 3 sequentially');
    assert(summary.keys[0].status === 'COOLDOWN' && summary.keys[1].status === 'COOLDOWN', 'Scenario 3: Keys 1 & 2 placed in cooldown');
    assert(summary.keys[2].status === 'HEALTHY' && summary.activeKeyIndex === 2, 'Scenario 3: Key 3 is active and healthy');
  }

  // ------------------------------------------------------------
  // Scenario 4: All three keys fail with rate limits
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    let caughtError = null;
    try {
      await manager.executeWithFailover(async (keyObj) => {
        calls.push(keyObj.name);
        throw makeRateLimitError();
      });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null, 'Scenario 4: Error thrown when all keys are rate limited');
    assert(caughtError.status === 429 && caughtError.code === 'RATE_LIMITED', 'Scenario 4: Friendly 429 RATE_LIMITED code returned');
    assert(caughtError.message.includes('All configured Gemini AI keys have temporarily reached their rate limit'), 'Scenario 4: Safe, friendly message returned without leaking keys');
    assert(calls.length === 3, `Scenario 4: Strictly limited to 3 key attempts (calls=${calls.length}) without infinite loop`);

    const summary = manager.getStatusSummary();
    assert(
      summary.keys.every(k => k.status === 'COOLDOWN'),
      'Scenario 4: All keys recorded in cooldown state'
    );
  }

  // ------------------------------------------------------------
  // Scenario 5: Invalid API key is handled correctly
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    const result = await manager.executeWithFailover(async (keyObj) => {
      calls.push(keyObj.name);
      if (keyObj.name === 'Key #1') {
        throw makeInvalidKeyError();
      }
      return { success: true, text: 'Key 2 succeeded after Key 1 invalid' };
    });

    const summary = manager.getStatusSummary();
    assert(result.success === true, 'Scenario 5: Failover succeeded to Key 2 after Key 1 was invalid');
    assert(summary.keys[0].status === 'INVALID', 'Scenario 5: Key 1 marked as permanently INVALID');

    // Verify Key 1 is NEVER retried on next calls
    const nextCalls = [];
    await manager.executeWithFailover(async (keyObj) => {
      nextCalls.push(keyObj.name);
      return { success: true };
    });
    assert(!nextCalls.includes('Key #1'), 'Scenario 5: Invalid Key 1 is never retried');

    // If ALL keys are invalid, returns 401 INVALID_KEY
    const allInvalidManager = new GeminiKeyManager();
    allInvalidManager._resetForTesting(sampleKeys);
    let allInvalidErr = null;
    try {
      await allInvalidManager.executeWithFailover(async () => {
        throw makeInvalidKeyError();
      });
    } catch (e) {
      allInvalidErr = e;
    }
    assert(allInvalidErr && allInvalidErr.status === 401 && allInvalidErr.code === 'INVALID_KEY', 'Scenario 5: All keys invalid returns clean 401 INVALID_KEY');
  }

  // ------------------------------------------------------------
  // Scenario 6: Permanent request error does NOT trigger unnecessary retries
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    let caughtError = null;
    try {
      await manager.executeWithFailover(async (keyObj) => {
        calls.push(keyObj.name);
        throw makeBadRequestError();
      });
    } catch (err) {
      caughtError = err;
    }

    assert(caughtError !== null && caughtError.message.includes('INVALID_ARGUMENT'), 'Scenario 6: Client bad request error rethrown');
    assert(calls.length === 1, `Scenario 6: Exactly 1 call made (no unnecessary retries on malformed request; calls=${calls.length})`);

    const summary = manager.getStatusSummary();
    assert(summary.keys[0].status === 'HEALTHY', 'Scenario 6: Key 1 was not penalized or put in cooldown for client-side request error');
  }

  // ------------------------------------------------------------
  // Scenario 7: Multiple simultaneous AI requests handle concurrency safely
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    // Simulate 12 concurrent requests
    // Key 1 will fail with 429 for the first request, Key 2 will succeed for all
    let key1Attempts = 0;
    let key2Attempts = 0;

    const requestPromises = Array.from({ length: 12 }, async (_, i) => {
      return manager.executeWithFailover(async (keyObj) => {
        if (keyObj.name === 'Key #1') {
          key1Attempts++;
          throw makeRateLimitError();
        }
        if (keyObj.name === 'Key #2') {
          key2Attempts++;
          return { reqIndex: i, keyUsed: keyObj.name };
        }
        return { reqIndex: i, keyUsed: keyObj.name };
      });
    });

    const results = await Promise.all(requestPromises);

    assert(results.length === 12, 'Scenario 7: All 12 concurrent requests resolved successfully');
    assert(results.every(r => r.keyUsed === 'Key #2'), 'Scenario 7: All requests succeeded via healthy Key #2');
    assert(key1Attempts <= 12, `Scenario 7: Key 1 was attempted within bound (key1Attempts=${key1Attempts})`);
    assert(key2Attempts === 12, 'Scenario 7: Key 2 handled all concurrent requests without uncontrolled loops');

    // While Key 1 is now in cooldown, all newly arriving concurrent requests directly use Key 2:
    let newBatchKey1Attempts = 0;
    const newBatch = await Promise.all(Array.from({ length: 5 }, async () => {
      return manager.executeWithFailover(async (keyObj) => {
        if (keyObj.name === 'Key #1') newBatchKey1Attempts++;
        return keyObj.name;
      });
    }));
    assert(newBatchKey1Attempts === 0, 'Scenario 7: New concurrent requests immediately bypass Key 1 in cooldown');
    assert(newBatch.every(name => name === 'Key #2'), 'Scenario 7: All new concurrent requests seamlessly use Key 2');
  }

  // ------------------------------------------------------------
  // Scenario 8: Transient 503 error failover with jitter backoff
  // ------------------------------------------------------------
  {
    const manager = new GeminiKeyManager();
    manager._resetForTesting(sampleKeys);

    const calls = [];
    const result = await manager.executeWithFailover(async (keyObj) => {
      calls.push(keyObj.name);
      if (keyObj.name === 'Key #1') {
        throw makeTransientError();
      }
      return { success: true, text: 'Recovered from transient 503 on Key 2' };
    });

    assert(result.success === true, 'Scenario 8: Transient 503 error automatically recovered on next key');
    assert(calls.length === 2 && calls[0] === 'Key #1' && calls[1] === 'Key #2', 'Scenario 8: Failed over smoothly on transient 503');
  }

  // ------------------------------------------------------------
  // Scenario 9: Safe key masking & zero credential leakage
  // ------------------------------------------------------------
  {
    const masked = GeminiKeyManager.maskKey('AIzaSyD-1234567890abcdefghijklmnopqrstuvwxyz');
    assert(masked === 'AIzaSy...wxyz', 'Scenario 9: Key correctly masked with first 6 and last 4 characters');
    assert(!masked.includes('1234567890'), 'Scenario 9: Secret middle portion of key is completely hidden');
  }

  console.log(`\n======================================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runFailoverTests().catch(err => {
  console.error('Test execution failure:', err);
  process.exit(1);
});
