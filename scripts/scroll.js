// Scrollt das Dashboard durch und macht mehrere Screenshots (RN-web scrollt intern).
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
  await page.goto('http://localhost:8081/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);

  async function clickText(t) {
    const el = page.getByText(t, { exact: false }).first();
    if (await el.count()) { await el.click().catch(() => {}); await page.waitForTimeout(400); }
  }
  // Falls Onboarding sichtbar: durchklicken
  if (await page.getByText('Welche Sportarten?', { exact: false }).count()) {
    await clickText('Fußball'); await clickText('Weiter');
    await clickText('Bayern'); await clickText('Weiter'); await clickText('Fertig');
    await page.waitForTimeout(2000);
  }

  // Mitte des Bildschirms für Wheel-Scroll
  await page.mouse.move(207, 450);
  for (let i = 1; i <= 3; i++) {
    await page.mouse.wheel(0, 760);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `scripts/scroll${i}.png` });
  }
  await browser.close();
  console.log('DONE');
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
