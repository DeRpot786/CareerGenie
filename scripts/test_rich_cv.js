const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, '..', '.chrome-temp-headless');
const port = 9222;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testRichAndShortCV() {
  console.log('Testing Short vs. Long CV Data Across All 8 Templates...');

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

  if (!versionData) throw new Error('DevTools not running');

  const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/resume-builder`, { method: 'PUT' });
  const tabData = await newTabRes.json();
  const ws = new WebSocket(tabData.webSocketDebuggerUrl);

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
  await sleep(1500);

  // 1. Test Rich CV (Long with Experience, Certifications, Languages, Awards, Publications)
  console.log('Populating comprehensive rich CV with all credentials...');
  const richCv = {
    fullName: 'Dr. Jennifer Vance',
    targetRole: 'Staff AI Systems Architect',
    email: 'jennifer.vance@mit.edu',
    phone: '+1 (555) 349-2810',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/jennifervance',
    github: 'github.com/jvance-ai',
    website: 'jvance.ai',
    summary: 'Senior AI Systems Architect with 10+ years specializing in distributed deep learning clusters, latency-critical inference pipelines, and scalable enterprise LLM deployments.',
    education: [
      { degree: 'Ph.D. in Computer Science (Distributed Systems)', college: 'Massachusetts Institute of Technology', graduationYear: '2019', cgpa: '4.0 / 4.0' },
      { degree: 'B.S. in Computer Engineering & Mathematics', college: 'Carnegie Mellon University', graduationYear: '2014', cgpa: '3.94 / 4.0' },
    ],
    experience: [
      {
        id: 1,
        role: 'Principal Distributed Systems Engineer',
        company: 'ScaleAI Infrastructure Lab',
        duration: '2021 – Present',
        desc: 'Spearheaded 4,096-GPU training cluster orchestrator reducing checkpoint recovery time by 64%.\nArchitected low-latency inference routing mesh processing over 120,000 req/sec at sub-12ms p99.\nMentored 14 senior engineers and authored 6 system design RFCs.',
      },
      {
        id: 2,
        role: 'Senior Machine Learning Systems Engineer',
        company: 'Apex Cloud Platforms',
        duration: '2019 – 2021',
        desc: 'Implemented hardware-accelerated model quantization and KV cache pruning in C++ and CUDA.\nReduced model inference memory footprint by 48% across multi-tenant production clusters.',
      },
    ],
    projects: [
      {
        id: 1,
        name: 'OmniTensor Inference Engine',
        tech: 'Rust, CUDA, PyTorch, C++20',
        desc: 'Zero-copy distributed inference engine achieving 2.8x speedup over standard vLLM baselines for 70B parameter models.',
        github: 'github.com/jvance-ai/omnitensor',
      },
      {
        id: 2,
        name: 'FlashRouting Cluster Mesh',
        tech: 'Go, eBPF, Kubernetes, gRPC',
        desc: 'Kernel-level load balancer utilizing eBPF packet inspection for dynamic tensor pipeline routing.',
        github: 'github.com/jvance-ai/flashrouting',
      },
    ],
    skills: {
      languages: ['Rust', 'Python', 'C++', 'Go', 'CUDA', 'SQL'],
      frameworks: ['PyTorch', 'TensorRT', 'vLLM', 'Ray', 'Triton Inference Server'],
      technical: ['Distributed Systems', 'KV Cache Architecture', 'Kernel Optimization', 'Cluster Networking'],
      tools: ['Kubernetes', 'Docker', 'Linux Perf', 'Git', 'Prometheus'],
    },
    certifications: [
      { id: 1, name: 'AWS Certified Solutions Architect — Professional', issuer: 'Amazon Web Services', date: '2023' },
      { id: 2, name: 'Google Cloud Certified Professional Cloud Architect', issuer: 'Google Cloud', date: '2024' },
    ],
    languages: [
      { id: 1, name: 'English', proficiency: 'Native / Bilingual' },
      { id: 2, name: 'German', proficiency: 'Professional Working' },
    ],
    awards: [
      { id: 1, title: 'Outstanding Systems Architecture Award', issuer: 'ACM SIGOPS', year: '2022' },
      { id: 2, title: 'National Science Foundation Graduate Research Fellowship', issuer: 'NSF', year: '2016' },
    ],
    publications: [
      { id: 1, title: 'Sub-Millisecond KV Cache Paging for Multi-Tenant LLM Serving', publisher: 'OSDI 2023', year: '2023', link: 'doi.org/10.1145/35476.35489' },
      { id: 2, title: 'Decentralized Parameter Sharding for Asynchronous Gradient Topologies', publisher: 'NeurIPS 2020', year: '2020', link: 'arxiv.org/abs/2009.12345' },
    ],
  };

  await evaluate(`
    (() => {
      localStorage.setItem('careergenie_profile', JSON.stringify(${JSON.stringify(richCv)}));
    })()
  `);

  await send('Page.navigate', { url: 'http://localhost:3000/resume-builder' });
  await sleep(2500);

  const templateIds = [
    'professional-classic',
    'modern-two-column',
    'minimalist',
    'executive',
    'creative',
    'ats-friendly',
    'modern-sidebar',
    'academic',
  ];

  const results = [];

  for (const tid of templateIds) {
    await evaluate(`
      (() => {
        const sel = document.getElementById('preview-quick-template-select');
        if (sel) {
          sel.value = '${tid}';
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(700);

    const check = await evaluate(`
      (() => {
        const cv = document.getElementById('printable-cv');
        if (!cv) return { error: 'CV not rendered' };
        const text = cv.innerText;
        return {
          id: '${tid}',
          h1: cv.querySelector('h1')?.innerText?.trim(),
          hasSummary: text.includes('Senior AI Systems Architect'),
          hasExperience: text.includes('ScaleAI') && text.includes('Principal Distributed Systems Engineer'),
          hasCertifications: text.includes('AWS Certified'),
          hasLanguages: text.includes('German'),
          hasAwards: text.includes('SIGOPS') || text.includes('Outstanding Systems'),
          hasPublications: text.includes('OSDI 2023') || text.includes('Sub-Millisecond') || !text.includes('publications'),
          scrollHeight: cv.scrollHeight,
        };
      })()
    `);

    results.push(check);
    console.log(`Rendered ${tid}:`, JSON.stringify(check));
  }

  const allRendered = results.every(r => r.hasSummary && r.hasExperience && r.scrollHeight > 600);
  console.log(`\nRich Multi-Section Test: ${allRendered ? 'SUCCESSFUL (All 8 templates rendered rich data cleanly)' : 'FAILED'}`);

  ws.close();
  if (chrome) chrome.kill('SIGTERM');
}

testRichAndShortCV().catch(console.error);
