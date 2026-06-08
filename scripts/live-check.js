// Prüft die ÖFFENTLICHE GitHub-Pages-URL im echten Browser (inkl. Live-Daten).
const { chromium } = require('playwright-core');
const URL = 'https://marcel-fe.github.io/sport-goal/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);

  async function click(t) {
    const el = page.getByText(t, { exact: false }).first();
    if (await el.count()) { await el.click().catch(() => {}); await page.waitForTimeout(500); }
  }
  await click('Fußball'); await click('Weiter');
  await click('FC Bayern München'); await click('Weiter'); await click('Fertig');
  await page.waitForTimeout(7000);
  await page.screenshot({ path: 'scripts/online.png', fullPage: true });

  const txt = (await page.locator('body').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 220);
  console.log('TEXT:', txt);
  console.log('ERRORS:', errors.length);
  errors.slice(0, 6).forEach((e) => console.log('  ', e));
  await browser.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
