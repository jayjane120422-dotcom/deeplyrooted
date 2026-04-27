// Deeply Rooted — Deploy Script (GitHub Pages)
// Run with: node deploy.js
// This pushes all changes to GitHub, which auto-deploys via GitHub Pages.

const { execSync } = require('child_process');
const path = require('path');

const BASE = path.resolve(__dirname);

// Site URLs
const GITHUB_PAGES_URL = 'https://jayjane120422-dotcom.github.io/deeply-rooted-hair-essentials/';
const NETLIFY_URL = 'https://deeplyrooted.netlify.app/'; // (paused — Netlify credit limit reached)

function run(cmd) {
  console.log(`  > ${cmd}`);
  try {
    const output = execSync(cmd, { cwd: BASE, encoding: 'utf8', stdio: 'pipe' });
    if (output.trim()) console.log(`    ${output.trim()}`);
    return output;
  } catch (e) {
    console.log(`    ${e.stderr || e.message}`);
    return null;
  }
}

async function deploy() {
  console.log('🚀 Deeply Rooted — Deploy to GitHub Pages\n');

  // 1. Check for changes
  console.log('📂 Checking for changes...');
  const status = run('git status --porcelain');
  
  if (!status || status.trim() === '') {
    console.log('  No changes to deploy.\n');
    
    // Still push in case there are unpushed commits
    console.log('📤 Pushing any unpushed commits...');
    run('git push origin main');
  } else {
    // 2. Stage all changes
    console.log('\n📦 Staging changes...');
    run('git add -A');

    // 3. Commit
    const timestamp = new Date().toISOString().split('T')[0];
    const commitMsg = `Deploy: ${timestamp} update`;
    console.log(`\n💾 Committing: "${commitMsg}"`);
    run(`git commit -m "${commitMsg}"`);

    // 4. Push
    console.log('\n📤 Pushing to GitHub...');
    run('git push origin main');
  }

  console.log('\n🎉 Deploy complete!');
  console.log(`🌐 ${GITHUB_PAGES_URL}`);
  console.log('\nNote: GitHub Pages may take 1-2 minutes to update.\n');
}

deploy().catch(err => console.error('❌', err));
