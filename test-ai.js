// ============================================================
// CAREER GENIE — AI Endpoint & Integration Test Suite
// ============================================================

const aiHandler = require('./api/ai.js');

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k] = v; },
    end(data) { this.body = data; return this; }
  };
}

async function runTests() {
  console.log('🧪 Starting Career Genie AI Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // Test 1: Method Not Allowed
  {
    const req = { method: 'GET', url: '/api/ai' };
    const res = mockRes();
    await aiHandler(req, res);
    const json = JSON.parse(res.body);
    assert(res.statusCode === 405 && json.success === false, 'GET request returns 405 Method Not Allowed');
  }

  // Test 2: OPTIONS Preflight
  {
    const req = { method: 'OPTIONS', url: '/api/ai' };
    const res = mockRes();
    await aiHandler(req, res);
    assert(res.statusCode === 200, 'OPTIONS request returns 200 with CORS headers');
  }

  // Test 3: Missing Body
  {
    const req = { method: 'POST', url: '/api/ai', body: {} };
    const res = mockRes();
    await aiHandler(req, res);
    const json = JSON.parse(res.body);
    assert(res.statusCode === 400 && json.error.includes('Missing "task"'), 'Missing task/payload returns 400');
  }

  // Test 4: Missing API Key Handling
  {
    const savedK1 = process.env.GEMINI_API_KEY_1;
    const savedK2 = process.env.GEMINI_API_KEY_2;
    const savedK3 = process.env.GEMINI_API_KEY_3;
    const savedGemini = process.env.GEMINI_API_KEY;
    const savedOpenAI = process.env.OPENAI_API_KEY;
    const savedAI = process.env.AI_API_KEY;

    delete process.env.GEMINI_API_KEY_1;
    delete process.env.GEMINI_API_KEY_2;
    delete process.env.GEMINI_API_KEY_3;
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.AI_API_KEY;

    const { geminiKeyManager } = require('./api/geminiKeyManager');
    geminiKeyManager.reloadKeys();

    const req = {
      method: 'POST',
      url: '/api/ai',
      body: {
        task: 'generate_summary',
        payload: { targetCareer: 'Frontend Developer' }
      }
    };
    const res = mockRes();
    await aiHandler(req, res);
    const json = JSON.parse(res.body);
    assert(res.statusCode === 503 && json.code === 'KEY_MISSING' && json.success === false, 'Missing API Key returns friendly 503 KEY_MISSING error without leaking secrets');

    // Restore
    if (savedK1) process.env.GEMINI_API_KEY_1 = savedK1;
    if (savedK2) process.env.GEMINI_API_KEY_2 = savedK2;
    if (savedK3) process.env.GEMINI_API_KEY_3 = savedK3;
    if (savedGemini) process.env.GEMINI_API_KEY = savedGemini;
    if (savedOpenAI) process.env.OPENAI_API_KEY = savedOpenAI;
    if (savedAI) process.env.AI_API_KEY = savedAI;
    geminiKeyManager.reloadKeys();
  }

  // Test 5: Verify CORS Headers
  {
    const req = { method: 'POST', url: '/api/ai', body: {} };
    const res = mockRes();
    await aiHandler(req, res);
    assert(res.headers['Access-Control-Allow-Origin'] === '*', 'CORS headers are set correctly');
  }

  // Test 6: Verify Mistral Provider Selection
  {
    const savedProvider = process.env.AI_PROVIDER;
    const savedMistralKey = process.env.MISTRAL_API_KEY;

    process.env.AI_PROVIDER = 'mistral';
    process.env.MISTRAL_API_KEY = 'test_mistral_api_key_12345';

    const provider = aiHandler.resolveAIProvider();
    assert(provider === 'mistral', 'Mistral AI is resolved as primary provider when configured');

    if (savedProvider) process.env.AI_PROVIDER = savedProvider;
    else delete process.env.AI_PROVIDER;

    if (savedMistralKey) process.env.MISTRAL_API_KEY = savedMistralKey;
    else delete process.env.MISTRAL_API_KEY;
  }

  // Test 7: Missing Mistral API Key returns friendly 503
  {
    const savedProvider = process.env.AI_PROVIDER;
    const savedMistralKey = process.env.MISTRAL_API_KEY;

    process.env.AI_PROVIDER = 'mistral';
    delete process.env.MISTRAL_API_KEY;

    const req = {
      method: 'POST',
      url: '/api/ai',
      body: {
        task: 'generate_summary',
        payload: { targetCareer: 'Full Stack Engineer' }
      }
    };
    const res = mockRes();
    await aiHandler(req, res);
    const json = JSON.parse(res.body);
    assert(res.statusCode === 503 && json.code === 'KEY_MISSING' && json.error.includes('Mistral API key is not configured'), 'Missing Mistral API Key returns friendly 503 KEY_MISSING');

    if (savedProvider) process.env.AI_PROVIDER = savedProvider;
    else delete process.env.AI_PROVIDER;

    if (savedMistralKey) process.env.MISTRAL_API_KEY = savedMistralKey;
    else delete process.env.MISTRAL_API_KEY;
  }

  // Test 8: Verify extractJSON robust parsing
  {
    const plainJson = '{"options":[{"id":"focused","summary":"Direct bio"}]}';
    const fencedJson = '```json\n{"options":[{"id":"focused","summary":"Direct bio"}]}\n```';
    const noisyJson = 'Here is the response:\n```\n{"options":[{"id":"focused","summary":"Direct bio"}]}\n```\nHope this helps!';

    const parsedPlain = aiHandler.extractJSON(plainJson);
    const parsedFenced = aiHandler.extractJSON(fencedJson);
    const parsedNoisy = aiHandler.extractJSON(noisyJson);

    assert(parsedPlain.options?.[0]?.id === 'focused', 'extractJSON parses standard JSON cleanly');
    assert(parsedFenced.options?.[0]?.id === 'focused', 'extractJSON strips markdown code fences');
    assert(parsedNoisy.options?.[0]?.id === 'focused', 'extractJSON extracts JSON from noisy response text');
  }

  // Test 9: Verify Log Sanitization redacts keys and Bearer tokens
  {
    const dirty = 'Error with key=test-mock-key-123456 and Bearer sample-auth-token-test and AQ.MOCK_TEST_SAMPLE_KEY_STRING_VALUE_FOR_UNIT_TEST_1234567890';
    const clean = aiHandler.sanitizeLogMessage(dirty);
    assert(!clean.includes('test-mock-key') && !clean.includes('sample-auth') && !clean.includes('MOCK_TEST'), 'sanitizeLogMessage redacts all Mistral, Gemini, and Bearer tokens');
  }

  console.log(`\n======================================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
