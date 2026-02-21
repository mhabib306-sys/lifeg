#!/usr/bin/env node
/**
 * One-time script to add VPS deploy secrets to GitHub.
 * Run: GITHUB_TOKEN=ghp_xxx node scripts/set-github-secrets.js
 * Create a PAT at: https://github.com/settings/tokens (scope: repo)
 */
const https = require('https');
const { execSync } = require('child_process');

const owner = 'mhabib306-sys';
const repo = 'lifeg';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

const secrets = {
  VPS_HOST: '46.101.197.104',
  VPS_USER: 'muhammad',
  VPS_SSH_KEY: null, // Will be read from file
};

function get(path) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, 'https://api.github.com');
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(d));
        } catch {
          reject(new Error(d));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function put(path, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, 'https://api.github.com');
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  if (!token) {
    console.error('Set GITHUB_TOKEN or GH_TOKEN. Create a PAT at https://github.com/settings/tokens (scope: repo)');
    process.exit(1);
  }

  // Try gh cli first (simplest)
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    console.log('Using gh CLI...');
    execSync(`gh secret set VPS_HOST --body "46.101.197.104" --repo ${owner}/${repo}`, { stdio: 'inherit' });
    execSync(`gh secret set VPS_USER --body "muhammad" --repo ${owner}/${repo}`, { stdio: 'inherit' });
    const keyPath = process.env.HOME + '/.ssh/github_deploy';
    const key = require('fs').readFileSync(keyPath, 'utf8');
    execSync(`gh secret set VPS_SSH_KEY --body "$(cat ${keyPath})" --repo ${owner}/${repo}`, { stdio: 'inherit', shell: true });
    console.log('Done.');
    return;
  } catch {
    // gh not available or not auth'd
  }

  // Fallback: use API with libsodium encryption
  try {
    const sodium = require('libsodium-wrappers');
    await sodium.ready;
  } catch {
    console.error('Install gh CLI (apt install gh, gh auth login) OR:');
    console.error('  npm install libsodium-wrappers');
    console.error('  GITHUB_TOKEN=ghp_xxx node scripts/set-github-secrets.js');
    process.exit(1);
  }

  const sodium = require('libsodium-wrappers');
  await sodium.ready;

  const pk = await get(`/repos/${owner}/${repo}/actions/secrets/public-key`);
  if (pk.message) throw new Error(pk.message);

  const publicKey = Buffer.from(pk.key, 'base64');
  const keyId = pk.key_id;

  const keyPath = process.env.HOME + '/.ssh/github_deploy';
  secrets.VPS_SSH_KEY = require('fs').readFileSync(keyPath, 'utf8');

  for (const [name, value] of Object.entries(secrets)) {
    if (!value) continue;
    const encrypted = sodium.crypto_box_seal(value, publicKey);
    const encB64 = Buffer.from(encrypted).toString('base64');
    const r = await put(`/repos/${owner}/${repo}/actions/secrets/${name}`, {
      encrypted_value: encB64,
      key_id: keyId,
    });
    if (r.status >= 400) throw new Error(`Failed ${name}: ${r.body}`);
    console.log(`Set ${name}`);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
