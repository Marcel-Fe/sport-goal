// Einmaliger Screenshot-Check des laufenden Web-Prototyps (nutzt installiertes Edge).
const { chromium } = require('playwright-core');

(async () => {
  const channels = ['msedge', 'chrome'];
  let browser;
  for (const channel of channels) {
    try {
      browser = await chromium.launch({ channel, headless: true });
      console.log('Browser:', channel);
      break;
    } catch (e) {
      console.log('channel failed:', channel, e.message.split('\n')[0]);
    }
  }
  if (!browser) {
    console.log('NO_BROWSER');
    process.exit(2);
  }

  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto('http://localhost:8081/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'scripts/onboarding.png', fullPage: false });
  const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 200);
  console.log('--- ONBOARDING textgrab ---');
  console.log(bodyText.replace(/\n+/g, ' | '));

  // Onboarding durchklicken: Sportart -> Verein -> Fertig
  async function clickText(t) {
    const el = page.getByText(t, { exact: false }).first();
    if (await el.count()) {
      await el.click().catch(() => {});
      await page.waitForTimeout(400);
      return true;
    }
    return false;
  }
  await clickText('Fußball');
  await clickText('Weiter');
  await clickText('Bayern');
  await clickText('Weiter');
  await clickText('Fertig');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'scripts/dashboard.png', fullPage: true });

  console.log('--- CONSOLE ERRORS (' + errors.length + ') ---');
  errors.slice(0, 15).forEach((e) => console.log(e));
  await browser.close();
  console.log('DONE');
})().catch((e) => {
  console.error('SCRIPT_FAIL', e.message);
  process.exit(1);
});
