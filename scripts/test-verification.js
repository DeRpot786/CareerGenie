// Comprehensive Test Verification Script for CareerGenie
const http = require('http');

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 CareerGenie Full Verification Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(title, condition, extra = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${title}`);
    } else {
      console.error(`❌ [FAIL] ${title} - ${extra}`);
    }
  }

  // ----------------------------------------------------
  // TEST GROUP 1: AUTHENTICATION FLOWS
  // ----------------------------------------------------
  console.log('--- PART 1: AUTHENTICATION & SECURITY ---');

  // 1.1 Demo Student Login
  const studentRes = await post('/api/auth/login', {
    usernameOrEmail: 'alex.thomas@example.com',
    password: 'Password@123',
  });
  assert(
    'Demo Student Login succeeds with 200 and returns valid JWT token',
    studentRes.status === 200 && studentRes.body?.token && studentRes.body?.user?.email === 'alex.thomas@example.com',
    JSON.stringify(studentRes)
  );

  const studentToken = studentRes.body?.token;

  // 1.2 Demo Admin Login
  const adminRes = await post('/api/auth/login', {
    usernameOrEmail: 'admin@careergenie.dev',
    password: 'Admin@123',
  });
  assert(
    'Demo Admin Login succeeds with 200 and returns role ADMIN',
    adminRes.status === 200 && adminRes.body?.token && adminRes.body?.user?.role === 'ADMIN',
    JSON.stringify(adminRes)
  );

  // 1.3 Invalid Password Rejected
  const invalidPwdRes = await post('/api/auth/login', {
    usernameOrEmail: 'alex.thomas@example.com',
    password: 'WrongPassword999!',
  });
  assert(
    'Invalid password returns 401 Unauthorized',
    invalidPwdRes.status === 401 && (invalidPwdRes.body?.error || invalidPwdRes.body?.message),
    JSON.stringify(invalidPwdRes)
  );

  // 1.4 Nonexistent Account Rejected
  const noUserRes = await post('/api/auth/login', {
    usernameOrEmail: 'ghost.user.999@notfound.org',
    password: 'AnyPassword@123',
  });
  assert(
    'Nonexistent user returns 401 Unauthorized',
    noUserRes.status === 401 && (noUserRes.body?.error || noUserRes.body?.message),
    JSON.stringify(noUserRes)
  );

  // 1.5 Protected API with Bearer Token
  const meRes = await get('/api/auth/me', {
    Authorization: `Bearer ${studentToken}`,
  });
  assert(
    'Protected /api/auth/me returns 200 with authenticated profile',
    meRes.status === 200 && meRes.body?.email === 'alex.thomas@example.com',
    JSON.stringify(meRes)
  );

  // 1.6 Unauthenticated Access Rejected
  const unauthRes = await get('/api/auth/me');
  assert(
    'Unauthenticated /api/auth/me returns 401',
    unauthRes.status === 401,
    JSON.stringify(unauthRes)
  );

  // 1.7 Logout Invalidates Session
  const logoutRes = await post('/api/auth/logout', {}, {
    Authorization: `Bearer ${studentToken}`,
  });
  assert(
    'Logout endpoint returns 200 and invalidates session token',
    logoutRes.status === 200 && logoutRes.body?.success === true,
    JSON.stringify(logoutRes)
  );

  const meAfterLogout = await get('/api/auth/me', {
    Authorization: `Bearer ${studentToken}`,
  });
  assert(
    'Subsequent request with revoked token returns 401',
    meAfterLogout.status === 401,
    JSON.stringify(meAfterLogout)
  );

  // ----------------------------------------------------
  // TEST GROUP 2: AI BACKEND ARCHITECTURE & GEMINI API
  // ----------------------------------------------------
  console.log('\n--- PART 2: AI SERVICES & GEMINI ENDPOINTS ---');

  // 2.1 Malformed AI Request Validation
  const malformedRes = await post('/api/ai', {});
  assert(
    'Missing task parameter returns 400 Bad Request',
    malformedRes.status === 400 && malformedRes.body?.error,
    JSON.stringify(malformedRes)
  );

  // 2.2 Live Career Chat with Gemini
  const chatRes = await post('/api/ai', {
    task: 'career_chat',
    messages: [
      { role: 'user', content: 'In 1 concise sentence, what is the best way for a junior React developer to showcase state management in a portfolio?' },
    ],
  });
  const chatData = chatRes.body?.data || chatRes.body;
  assert(
    'Live Gemini Career Chat returns genuine reply',
    chatRes.status === 200 && chatRes.body?.success === true && chatData?.reply && chatData.reply.length > 15,
    JSON.stringify(chatRes.body)
  );

  // 2.3 Bullet Point Rewriter
  const bulletRes = await post('/api/ai', {
    task: 'rewrite_bullet',
    bulletText: 'Built a website with React and CSS for customers.',
    style: 'Action & Impact',
    targetCareer: 'Frontend Engineer',
  });
  const bulletData = bulletRes.body?.data || bulletRes.body;
  assert(
    'Bullet Point Rewriter returns structured JSON variations',
    bulletRes.status === 200 && bulletRes.body?.success === true && Array.isArray(bulletData?.rewrittenOptions) && bulletData.rewrittenOptions.length > 0,
    JSON.stringify(bulletRes.body)
  );

  // 2.4 Interview Answer Evaluator
  const evalRes = await post('/api/ai', {
    task: 'evaluate_interview_answer',
    role: 'Frontend Engineer',
    question: 'How do you optimize render performance in React?',
    userAnswer: 'I use React.memo, useMemo, useCallback for functions passed to memoized children, and virtualize large lists with react-window.',
  });
  const evalData = evalRes.body?.data || evalRes.body;
  assert(
    'Interview Answer Evaluator returns scores and criteria feedback',
    evalRes.status === 200 && evalRes.body?.success === true && typeof evalData?.overallScore === 'number' && evalData?.whatWorkedWell,
    JSON.stringify(evalRes.body)
  );

  // 2.5 ATS Resume Audit
  const atsRes = await post('/api/ai', {
    task: 'ats_analysis',
    cvText: 'Alex Thomas. Frontend Developer. Skills: React, JavaScript, HTML, CSS, Git. Built e-commerce cart.',
    jobText: 'Looking for Frontend Engineer with React, TypeScript, responsive CSS, unit testing.',
    targetRole: 'Frontend Engineer',
  });
  const atsData = atsRes.body?.data || atsRes.body;
  assert(
    'ATS Deep Audit returns readiness assessment and checks breakdown',
    atsRes.status === 200 && atsRes.body?.success === true && typeof atsData?.atsScore === 'number' && Array.isArray(atsData?.checks),
    JSON.stringify(atsRes.body)
  );

  // 2.6 Job Application Assistant
  const appRes = await post('/api/ai', {
    task: 'job_application_assistant',
    targetRole: 'Frontend Developer',
    companyName: 'Acme Technologies',
    candidateName: 'Alex Thomas',
    keySkills: ['React', 'JavaScript', 'Tailwind CSS'],
  });
  const appData = appRes.body?.data || appRes.body;
  assert(
    'Job Application Assistant generates cold email and recruiter DM',
    appRes.status === 200 && appRes.body?.success === true && appData?.body && appData?.subject,
    JSON.stringify(appRes.body)
  );

  console.log('\n====================================================');
  console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ Some tests failed.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
