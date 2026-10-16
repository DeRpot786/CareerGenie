import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load environment variables from root .env.local or .env
function loadEnvVariables() {
  const envFiles = ['.env.local', '.env'];
  const rootDir = path.resolve((import.meta.dirname || '.'), '..');
  for (const file of envFiles) {
    const envPath = path.join(rootDir, file);
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx !== -1) {
              const key = trimmed.substring(0, eqIdx).trim();
              const val = trimmed.substring(eqIdx + 1).trim().replace(/(^['"]|['"]$)/g, '');
              if (!process.env[key]) {
                process.env[key] = val;
              }
            }
          }
        });
      } catch (e) {
        console.warn(`[Vite Env] Error reading ${file}:`, e.message);
      }
    }
  }
}

loadEnvVariables();

// Vite Plugin for integrated Mistral/Cloud AI serverless endpoint
function careerGenieApiPlugin() {
  return {
    name: 'career-genie-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;

        // AI API Route: /api/ai
        if (pathname === '/api/ai' || pathname === '/api/ai.js') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            return res.end(JSON.stringify({ status: 'ok' }));
          }

          let bodyData = '';
          req.on('data', (chunk) => {
            bodyData += chunk;
          });

          req.on('end', async () => {
            try {
              req.body = bodyData ? JSON.parse(bodyData) : {};
            } catch {
              req.body = bodyData;
            }

            delete require.cache[require.resolve('../api/ai.js')];
            let currentAiHandler;
            try {
              currentAiHandler = require('../api/ai.js');
            } catch (loadErr) {
              console.error('[Vite AI Require Error]:', loadErr);
            }

            if (currentAiHandler) {
              try {
                await currentAiHandler(req, res);
              } catch (err) {
                console.error('[Vite AI Handler Error]:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            } else {
              res.statusCode = 503;
              res.end(JSON.stringify({ success: false, error: 'AI Handler not initialized' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), careerGenieApiPlugin()],
  server: {
    port: 3000,
    proxy: {
      '^/api/(?!ai)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
