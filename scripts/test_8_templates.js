const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, '..', '.chrome-temp-headless');
const port = 9222;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting verification test for 8 distinct CV templates...');

  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--window-size=1440,1050',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let ws;
  try {
    console.log('Connecting to Chrome DevTools...');
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
      throw new Error('Could not connect to Chrome DevTools port ' + port);
    }

    const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/login`, { method: 'PUT' });
    const tabData = await newTabRes.json();
    const wsUrl = tabData.webSocketDebuggerUrl;

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

    console.log('Navigating to login page first to establish origin...');
    await send('Page.navigate', { url: 'http://localhost:3000/login' });
    await sleep(2000);

    console.log('Authenticating demo user Alex Thomas...');
    const authResult = await evaluate(`
      (async () => {
        try {
          const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'alex.thomas@example.com', password: 'Password@123' }),
          });
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('careergenie_token', data.token);
            localStorage.setItem('careergenie_user', JSON.stringify(data.user));
            return { success: true, user: data.user.fullName };
          }
          return { success: false, error: data };
        } catch (err) {
          return { success: false, error: err.message };
        }
      })()
    `);
    console.log('Auth result:', JSON.stringify(authResult));

    console.log('Navigating to Resume Builder (/resume-builder)...');
    await send('Page.navigate', { url: 'http://localhost:3000/resume-builder' });
    await sleep(2500);

    const screenshotsDir = path.join(__dirname, '..', 'template_screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const templatesToVerify = [
      { id: 'professional-classic', name: 'Professional Classic', expectedType: 'single-column' },
      { id: 'modern-two-column', name: 'Modern Two-Column', expectedType: 'two-column' },
      { id: 'minimalist', name: 'Minimalist', expectedType: 'single-column' },
      { id: 'executive', name: 'Executive', expectedType: 'executive' },
      { id: 'creative', name: 'Creative', expectedType: 'creative' },
      { id: 'ats-friendly', name: 'ATS-Friendly', expectedType: 'ats-linear' },
      { id: 'modern-sidebar', name: 'Modern Sidebar', expectedType: 'sidebar' },
      { id: 'academic', name: 'Academic', expectedType: 'academic' },
    ];

    const templateReports = [];

    for (const tpl of templatesToVerify) {
      console.log(`\n--------------------------------------------`);
      console.log(`Testing Template: ${tpl.name} (${tpl.id})`);
      console.log(`--------------------------------------------`);

      // Switch template using dropdown
      await evaluate(`
        (() => {
          const sel = document.getElementById('preview-quick-template-select');
          if (sel) {
            sel.value = '${tpl.id}';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `);
      await sleep(1000);

      // Deep inspection of rendered CV DOM
      const domDetails = await evaluate(`
        (() => {
          const cv = document.getElementById('printable-cv');
          if (!cv) return { error: 'printable-cv element not found' };

          const style = window.getComputedStyle(cv);
          const aside = cv.querySelector('aside');
          const main = cv.querySelector('main');
          const header = cv.querySelector('header');
          const h1 = cv.querySelector('h1')?.innerText?.trim();
          const headings = Array.from(cv.querySelectorAll('h2, h3, .cv-section-title')).map(h => h.innerText.trim());
          const listItems = cv.querySelectorAll('li').length;
          const links = cv.querySelectorAll('a').length;

          // Check if layout is two-column / flex / block
          const hasAside = !!aside;
          const isFlex = style.display === 'flex';

          // Measure widths if two-column or sidebar
          const asideWidth = aside ? window.getComputedStyle(aside).width : null;
          const mainWidth = main ? window.getComputedStyle(main).width : null;

          return {
            id: '${tpl.id}',
            name: '${tpl.name}',
            className: cv.className,
            fontFamily: style.fontFamily,
            display: style.display,
            hasAside,
            asideWidth,
            hasMain: !!main,
            mainWidth,
            h1,
            headingsCount: headings.length,
            headingsSample: headings.slice(0, 5),
            listItemsCount: listItems,
            hasHeader: !!header,
            headerTextSample: header ? header.innerText.replace(/\\s+/g, ' ').substring(0, 60) : null,
          };
        })()
      `);

      console.log('Report:', JSON.stringify(domDetails, null, 2));
      templateReports.push(domDetails);

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot.data) {
        const shotPath = path.join(screenshotsDir, `verified_${tpl.id}.png`);
        fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
        console.log(`Saved screenshot: ${shotPath}`);
      }
    }

    // Step 5 Picker & Wireframe Cards verification
    console.log('\n--------------------------------------------');
    console.log('Verifying Step 5 Template Grid & Wireframe Previews...');
    console.log('--------------------------------------------');

    await evaluate(`
      (() => {
        const step5 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('5. Template & Export') || b.innerText.includes('Templates & Export'));
        if (step5) step5.click();
      })()
    `);
    await sleep(1200);

    const step5Cards = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('[id^="template-btn-"]')).map(btn => {
          const svg = btn.querySelector('svg');
          return {
            id: btn.id.replace('template-btn-', ''),
            text: btn.innerText.replace(/\\s+/g, ' ').substring(0, 60),
            hasSvgThumbnail: !!svg,
            svgRectCount: svg ? svg.querySelectorAll('rect, line, circle').length : 0,
            isSelected: btn.innerText.includes('SELECTED'),
          };
        });
        return {
          totalCards: cards.length,
          cards,
        };
      })()
    `);
    console.log('Step 5 Cards Count:', step5Cards.totalCards);
    console.log('Step 5 Cards Details:', JSON.stringify(step5Cards, null, 2));

    // Test Color Customization Independently
    console.log('\n--------------------------------------------');
    console.log('Verifying Independent Accent Color Customization...');
    console.log('--------------------------------------------');

    // Click on Emerald Preset Swatch (#059669) in Step 5
    await evaluate(`
      (() => {
        const emeraldBtn = Array.from(document.querySelectorAll('button[title]')).find(b => b.title === 'Emerald' || b.title.includes('Emerald'));
        if (emeraldBtn) {
          emeraldBtn.click();
        } else {
          const colorInput = document.querySelector('input[type="color"]');
          if (colorInput) {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(colorInput, '#059669');
            colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            colorInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      })()
    `);
    await sleep(800);

    const colorReport = await evaluate(`
      (() => {
        const savedAccent = localStorage.getItem('careergenie_custom_accent');
        const cv = document.getElementById('printable-cv');
        return {
          savedAccent,
          cvExists: !!cv,
        };
      })()
    `);
    console.log('Color Customization Report:', JSON.stringify(colorReport, null, 2));

    // Test Data Preservation across switching
    console.log('\n--------------------------------------------');
    console.log('Verifying Data Preservation Across Template Switches...');
    console.log('--------------------------------------------');

    // Go to Step 1 and change candidate name
    await evaluate(`
      (() => {
        const step1 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1. Personal Details') || b.innerText.includes('Personal Info'));
        if (step1) step1.click();
      })()
    `);
    await sleep(800);

    const customName = 'Dr. Sarah Connor, Chief AI Officer';
    await evaluate(`
      (() => {
        const input = document.querySelector('input');
        if (input) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(input, '${customName}');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(800);

    // Switch across all 8 diverse templates and verify name is preserved in all
    const testIds = [
      'professional-classic',
      'modern-two-column',
      'minimalist',
      'executive',
      'creative',
      'ats-friendly',
      'modern-sidebar',
      'academic',
    ];
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
      await sleep(600);

      const check = await evaluate(`
        (() => {
          const cv = document.getElementById('printable-cv');
          const h1Text = cv?.querySelector('h1')?.innerText?.trim();
          return {
            template: '${tid}',
            h1Text,
            preserved: h1Text?.toUpperCase().includes('SARAH CONNOR'),
          };
        })()
      `);
      preservationResults.push(check);
    }
    console.log('Data Preservation Checks:', JSON.stringify(preservationResults, null, 2));

    const allPassed = preservationResults.every(r => r.preserved) && step5Cards.totalCards === 8;
    console.log(`\n============================================`);
    console.log(`TEST SUITE RESULT: ${allPassed ? 'ALL VERIFICATIONS PASSED ✅' : 'SOME VERIFICATIONS FAILED ❌'}`);
    console.log(`Total Templates Verified: ${templateReports.length} / 8`);
    console.log(`============================================\n`);

    fs.writeFileSync(
      path.join(screenshotsDir, 'eight_templates_test_report.json'),
      JSON.stringify({ templateReports, step5Cards, colorReport, preservationResults }, null, 2)
    );

  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGTERM');
  }
}

run();
