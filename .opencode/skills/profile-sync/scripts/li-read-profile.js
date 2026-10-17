// Read LinkedIn profile name/headline/about (logged-in session via CDP).
// Usage: node li-read-profile.js [profile-slug]
const { chromium } = require('playwright');

const slug = process.argv[2] || 'vinaykagithapu';

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const ctx = browser.contexts()[0];
  const li = ctx.pages().find((p) => p.url().includes('linkedin.com')) || (await ctx.newPage());
  await li.goto(`https://www.linkedin.com/in/${slug}/`, { waitUntil: 'domcontentloaded' });
  await li.waitForTimeout(4000);
  console.log('URL:', li.url());
  // No stable selectors (hashed classes) — parse main text instead.
  const text = await li.evaluate(() => {
    const m = document.querySelector('main');
    return (m?.innerText || document.body.innerText).slice(0, 1500);
  });
  console.log('---- MAIN TEXT ----\n' + text);
  await browser.close();
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
