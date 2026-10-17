// Set the GitHub bio in the logged-in session (CDP attach).
// Usage: node gh-set-bio.js "new bio text"   (defaults to the synced 2026-10 bio)
const { chromium } = require('playwright');

const DEFAULT_BIO =
  'AI Infrastructure & Platform Engineer — building, securing & scaling AI/LLM platforms. Kubernetes · DevSecOps · cloud-native.';
const BIO = process.argv[2] || DEFAULT_BIO;

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const ctx = browser.contexts()[0];
  const gh = ctx.pages().find((p) => p.url().includes('github.com')) || (await ctx.newPage());

  await gh.goto('https://github.com/settings/profile', { waitUntil: 'domcontentloaded' });
  await gh.waitForTimeout(2500);
  await gh.screenshot({ path: '/tmp/gh-profile-before.png' });

  // GitHub renamed the field user[bio] -> user[profile_bio]; if missing, dump names.
  let box = gh.locator('textarea[name="user[profile_bio]"]');
  if ((await box.count()) === 0) {
    for (const t of await gh.locator('form textarea').all()) {
      console.log('found textarea name=', await t.getAttribute('name'));
    }
    throw new Error('bio textarea not found — update the selector');
  }

  const before = await box.inputValue();
  console.log('BEFORE bio:', JSON.stringify(before));
  await box.fill(BIO);

  await gh.locator('form button[type="submit"]', { hasText: /update|save/i }).first().click();
  await gh.waitForTimeout(3000);

  const after = await gh.locator('textarea[name="user[profile_bio]"]').inputValue().catch(() => '(n/a)');
  console.log('AFTER bio: ', JSON.stringify(after));
  await gh.screenshot({ path: '/tmp/gh-profile-after.png' });
  await browser.close();
  console.log(after === BIO ? 'BIO UPDATED ✓' : 'CHECK MANUALLY — saved value differs');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
