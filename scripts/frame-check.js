// Prüft Handy-Rahmen (breites Fenster -> zentrierte Spalte), Teilen-Button, JS-Fehler.
const { chromium } = require('playwright-core');
const URL = process.argv[2] || 'http://localhost:8081/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 820 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);
  async function click(t) { const e = page.getByText(t, { exact: false }).first(); if (await e.count()) { await e.click().catch(()=>{}); await page.waitForTimeout(500); } }
  if (await page.getByText('Welche Sportarten?', { exact: false }).count()) {
    await click('Fußball'); await click('Weiter'); await click('FC Bayern München'); await click('Weiter'); await click('Fertig');
  }
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'scripts/frame-dashboard.png' });
  // zur "Mehr"-Seite (Tab = exakt "Mehr", nicht "Mehr ›")
  const mehr = page.getByText('Mehr', { exact: true }).last();
  if (await mehr.count()) { await mehr.click().catch(()=>{}); }
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'scripts/frame-more.png' });
  const body = await page.locator('body').innerText().catch(() => '');
  console.log('Teilen-Button:', body.includes('App teilen'));
  console.log('JS-Fehler:', errs.length);
  errs.slice(0, 5).forEach((e) => console.log('  ', e));
  await browser.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
