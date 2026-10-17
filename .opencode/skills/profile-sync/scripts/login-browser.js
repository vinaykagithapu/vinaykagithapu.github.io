// Headed browser for interactive login (GitHub + LinkedIn).
// Persistent profile + CDP on :9222 so automation can attach afterwards.
// Run with NODE_PATH pointing at a node_modules that contains playwright.
const { chromium } = require('playwright');

const PROFILE = '/home/vinay/.cache/opencode/login-browser';

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: false,
    args: ['--remote-debugging-port=9222', '--start-maximized'],
    viewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
  });
  const pages = ctx.pages();
  const gh = pages[0] ?? (await ctx.newPage());
  await gh.goto('https://github.com/login', { waitUntil: 'domcontentloaded' });
  const li = await ctx.newPage();
  await li.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });

  console.log('Browser open: GitHub + LinkedIn login tabs. CDP on :9222');
  console.log('Profile dir:', PROFILE);
  await new Promise(() => {}); // stay alive until killed
})().catch((e) => { console.error('LAUNCH FAILED:', e.message); process.exit(1); });
