// Deeply Rooted — Netlify Deploy Script
// Run with: node deploy.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SITE_ID = '0ea24ea2-6cd1-4768-b31f-884b18b2a4ec';
const TOKEN = 'nfp_MsuEznTvcP6p36vBvVyJF2aYEmzoaPkg7c32';
const BASE = path.resolve(__dirname);

function sha1(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

function api(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.netlify.com',
      path: `/api/v1${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': body && typeof body === 'string' ? 'application/json' : 'application/octet-stream'
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : body);
    req.end();
  });
}

// Collect all site files recursively
function getFiles(dir, base) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item.startsWith('.') || item.startsWith('_') || item === 'node_modules' || item === 'deploy.js') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full, base));
    } else {
      results.push({
        path: '/' + path.relative(base, full).replace(/\\/g, '/'),
        fullPath: full
      });
    }
  }
  return results;
}

async function deploy() {
  console.log('🚀 Deeply Rooted — Netlify Deploy\n');

  // 1. Collect files
  console.log('📂 Collecting files...');
  const files = getFiles(BASE, BASE);
  console.log(`  Found ${files.length} files\n`);

  // 2. Compute hashes
  console.log('🔑 Computing hashes...');
  const fileHashes = {};
  const fileBuffers = {};
  for (const f of files) {
    const buf = fs.readFileSync(f.fullPath);
    const hash = sha1(buf);
    fileHashes[f.path] = hash;
    fileBuffers[f.path] = buf;
  }

  // 3. Create deploy
  console.log('📤 Creating deploy...');
  const deploy = await api('POST', `/sites/${SITE_ID}/deploys`, JSON.stringify({ files: fileHashes }));
  if (!deploy.id) {
    console.error('❌ Failed:', deploy);
    return;
  }
  console.log(`  Deploy ID: ${deploy.id}`);
  console.log(`  Required uploads: ${deploy.required?.length || 0}\n`);

  // 4. Upload required files
  if (deploy.required && deploy.required.length > 0) {
    console.log('📤 Uploading changed files...');
    const required = new Set(deploy.required);

    for (const [fpath, hash] of Object.entries(fileHashes)) {
      if (required.has(hash)) {
        const filePath = fpath.startsWith('/') ? fpath.substring(1) : fpath;
        const encodedPath = filePath.split('/').map(s => encodeURIComponent(s)).join('/');
        process.stdout.write(`  Uploading ${filePath}...`);

        try {
          const result = await api('PUT', `/deploys/${deploy.id}/files/${encodedPath}`, fileBuffers[fpath]);
          console.log(' ✅');
          required.delete(hash);
        } catch(e) {
          console.log(` ❌ ${e.message}`);
        }
      }
    }

    if (required.size > 0) {
      console.log(`  ⚠️ ${required.size} files still needed`);
    }
  }

  // 5. Wait for ready
  console.log('\n⏳ Waiting for deploy...');
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2500));
    const status = await api('GET', `/deploys/${deploy.id}`);
    process.stdout.write(`  ${status.state} (${i + 1})\n`);

    if (status.state === 'ready') {
      console.log('\n🎉🎉🎉 DEPLOYED SUCCESSFULLY! 🎉🎉🎉');
      console.log('🌐 https://deeplyrooted.netlify.app/\n');
      return;
    }
    if (status.state === 'error') {
      console.error('❌ Deploy failed:', status.error_message);
      return;
    }
  }
  console.log('⚠️ Still processing — check Netlify dashboard');
}

deploy().catch(err => console.error('❌', err));
