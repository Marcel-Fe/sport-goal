// Rendert scripts/icon.html zu PNGs (App-Icon + Favicon).
const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(__dirname, 'icon.html').replace(/\\/g, '/'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'assets/images/icon.png', clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  await page.setViewportSize({ width: 196, height: 196 });
  await page.screenshot({ path: 'assets/images/favicon.png', clip: { x: 0, y: 0, width: 196, height: 196 } });
  await browser.close();
  console.log('ICON DONE');
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
