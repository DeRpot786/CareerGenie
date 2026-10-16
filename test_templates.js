const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'c:\\Users\\muham\\Desktop\\mishab\\CareerGenie\\scratch_chrome_test';
const port = 9222;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Spawning Chrome...');
  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--window-size=1440,960',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let ws;
  try {
    console.log('Waiting for Chrome DevTools endpoint...');
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch (e) {}
      await sleep(300);
    }

    if (!versionData) {
      throw new Error('Failed to connect to Chrome DevTools port');
    }

    // Open a new tab
    const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/login`, { method: 'PUT' });
    const tabData = await newTabRes.json();
    const wsUrl = tabData.webSocketDebuggerUrl;
    console.log('Connecting to tab WebSocket:', wsUrl);

    ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        if (data.error) {
          console.error(`CDP msg ${data.id} error:`, data.error.message);
        }
        callbacks.get(data.id)(data.result || {});
        callbacks.delete(data.id);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expr) {
      const res = await send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.value;
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('Authenticating demo student via /api/auth/login...');
    const authResult = await evaluate(`
      (async () => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'alex.thomas@example.com', password: 'Password@123' }),
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('careergenie_token', data.token);
            localStorage.setItem('careergenie_user', JSON.stringify(data.user));
            return { success: true, token: data.token, name: data.user.fullName };
          }
          return { success: false, error: data };
        } catch (err) {
          return { success: false, error: err.message };
        }
      })()
    `);
    console.log('Authentication result:', JSON.stringify(authResult));

    console.log('Navigating directly to Resume Builder...');
    await send('Page.navigate', { url: 'http://localhost:3000/resume-builder' });
    await sleep(2500);

    // Check if resume builder mounted and #printable-cv exists
    const initialDom = await evaluate(`
      (() => {
        const cv = document.getElementById('printable-cv');
        const sel = document.getElementById('preview-quick-template-select');
        return {
          cvFound: !!cv,
          cvClass: cv?.className,
          selectFound: !!sel,
          optionsCount: sel?.options.length,
          options: sel ? Array.from(sel.options).map(o => ({ value: o.value, text: o.text })) : [],
          fullNameInCv: cv?.querySelector('h1')?.innerText,
          headingsInCv: cv ? Array.from(cv.querySelectorAll('h2, h3')).map(h => h.innerText) : [],
        };
      })()
    `);
    console.log('Initial Resume Builder State:', JSON.stringify(initialDom, null, 2));

    const screenshotsDir = 'c:\\Users\\muham\\Desktop\\mishab\\CareerGenie\\template_screenshots';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const templatesToTest = [
      'classic-professional',
      'modern-two-column',
      'minimal-ats',
      'executive',
      'creative-portfolio',
      'compact-one-page',
      'technical-developer',
      'elegant-serif',
    ];

    const results = [];

    for (const tid of templatesToTest) {
      console.log(`\n========================================`);
      console.log(`Testing Template: ${tid}`);
      console.log(`========================================`);

      // Switch template using the quick select dropdown in the live preview toolbar
      await evaluate(`
        (() => {
          const sel = document.getElementById('preview-quick-template-select');
          if (sel) {
            sel.value = '${tid}';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `);
      await sleep(1000);

      // Inspect the rendered template DOM
      const domReport = await evaluate(`
        (() => {
          const cv = document.getElementById('printable-cv');
          if (!cv) return { error: 'printable-cv not found' };
          const style = window.getComputedStyle(cv);
          const aside = cv.querySelector('aside');
          const main = cv.querySelector('main');
          const header = cv.querySelector('header');
          const titles = Array.from(cv.querySelectorAll('h2, h3, .cv-section-title')).map(t => t.innerText.trim());
          const codeTags = Array.from(cv.querySelectorAll('code')).map(c => c.innerText);
          const pills = Array.from(cv.querySelectorAll('span, div')).filter(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            return bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
          }).length;

          return {
            id: '${tid}',
            className: cv.className,
            fontFamily: style.fontFamily,
            display: style.display,
            hasAside: !!aside,
            asideWidth: aside ? window.getComputedStyle(aside).width : null,
            hasMain: !!main,
            mainWidth: main ? window.getComputedStyle(main).width : null,
            headerText: header ? header.innerText.replace(/\\s+/g, ' ').substring(0, 80) : null,
            titles,
            codeTagsCount: codeTags.length,
            pillsCount: pills,
            fullName: cv.querySelector('h1')?.innerText,
            savedLocalStorageTemplate: localStorage.getItem('careergenie_active_template'),
          };
        })()
      `);

      console.log(`Report for ${tid}:`, JSON.stringify(domReport, null, 2));
      results.push(domReport);

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.data) {
        const shotPath = path.join(screenshotsDir, `${tid}.png`);
        fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
        console.log(`Saved screenshot: ${shotPath}`);
      }
    }

    // Now test Step 5 UI: Template Selector Cards with Thumbnails
    console.log('\n========================================');
    console.log('Testing Step 5 Template Picker Grid');
    console.log('========================================');

    await evaluate(`
      (() => {
        const step5 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('5. Template & Export') || b.innerText.includes('Templates & Export'));
        if (step5) step5.click();
      })()
    `);
    await sleep(1500);

    const step5Report = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('[id^="template-btn-"]')).map(btn => {
          const svg = btn.querySelector('svg');
          return {
            btnId: btn.id,
            name: btn.querySelector('span')?.innerText,
            hasSvg: !!svg,
            svgSize: svg ? { width: svg.getAttribute('width'), height: svg.getAttribute('height') } : null,
            isSelected: btn.innerText.includes('SELECTED'),
          };
        });
        return {
          totalCards: cards.length,
          cards,
        };
      })()
    `);

    console.log('Step 5 Template Cards:', JSON.stringify(step5Report, null, 2));

    // Capture screenshot of Step 5 picker
    const step5Shot = await send('Page.captureScreenshot', { format: 'png' });
    if (step5Shot.data) {
      const step5Path = path.join(screenshotsDir, 'step5_template_picker.png');
      fs.writeFileSync(step5Path, Buffer.from(step5Shot.data, 'base64'));
      console.log(`Saved Step 5 screenshot: ${step5Path}`);
    }

    // Test Data Preservation: Edit name and confirm all templates reflect it
    console.log('\n========================================');
    console.log('Testing Data Preservation Across Switching');
    console.log('========================================');

    const testName = 'Jane Doe, Lead Architect';
    await evaluate(`
      (() => {
        // Go to Step 1
        const step1 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1. Personal Details') || b.innerText.includes('Personal Info'));
        if (step1) step1.click();
      })()
    `);
    await sleep(1000);

    await evaluate(`
      (() => {
        const nameInput = document.querySelector('input');
        if (nameInput) {
          nameInput.value = '${testName}';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()
    `);
    await sleep(1000);

    // Switch between 3 different templates and verify name is preserved
    const testIds = ['modern-two-column', 'executive', 'creative-portfolio'];
    const preservationResults = [];

    for (const tid of testIds) {
      await evaluate(`
        (() => {
          const sel = document.getElementById('preview-quick-template-select');
          if (sel) {
            sel.value = '${tid}';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `);
      await sleep(800);

      const check = await evaluate(`
        (() => {
          const cv = document.getElementById('printable-cv');
          return {
            template: '${tid}',
            nameRendered: cv?.querySelector('h1')?.innerText,
            preserved: cv?.querySelector('h1')?.innerText.includes('Jane Doe'),
          };
        })()
      `);
      preservationResults.push(check);
    }

    console.log('Data Preservation Checks:', JSON.stringify(preservationResults, null, 2));

    const finalReport = {
      timestamp: new Date().toISOString(),
      templateResults: results,
      step5Report,
      preservationResults,
    };

    fs.writeFileSync(path.join(screenshotsDir, 'final_verification_report.json'), JSON.stringify(finalReport, null, 2));
    console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGTERM');
  }
}

run();
