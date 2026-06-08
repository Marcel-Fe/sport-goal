// Testet mehrere Sport-Profile durch das Onboarding und screenshotet das Dashboard.
const { chromium } = require('playwright-core');

const PROFILES = [
  { sport: 'Fußball', team: 'FC Bayern München', file: 'p_football.png' },
  { sport: 'Formel 1', team: 'Max Verstappen', file: 'p_f1.png' },
  { sport: 'Basketball', team: 'Los Angeles Lakers', file: 'p_nba.png' },
  { sport: 'Tennis', team: 'Novak Djokovic', file: 'p_tennis.png' },
  { sport: 'NFL', team: 'Kansas City Chiefs', file: 'p_nfl.png' },
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let totalErrors = 0;
  for (const p of PROFILES) {
    const ctx = await browser.newContext({ viewport: { width: 414, height: 896 } });
    const page = await ctx.newPage();
    const jsErrors = [];
    page.on('pageerror', (e) => jsErrors.push('PAGEERROR: ' + e.message));
    const errors = jsErrors; // nur echte JS-Fehler zählen (Netzwerk-Rauschen ignorieren)

    await page.goto('http://localhost:8081/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(4000);

    async function click(t) {
      const el = page.getByText(t, { exact: false }).first();
      if (await el.count()) { await el.click().catch(() => {}); await page.waitForTimeout(450); return true; }
      return false;
    }
    await click(p.sport);
    await click('Weiter');
    await click(p.team);
    await click('Weiter');
    await click('Fertig');
    await page.waitForTimeout(7000); // Live-Daten laden lassen
    await page.screenshot({ path: `scripts/${p.file}`, fullPage: true });

    const head = (await page.locator('body').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 120);
    console.log(`[${p.sport}] errors=${errors.length} :: ${head}`);
    totalErrors += errors.length;
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log('   ', e));
    await ctx.close();
  }
  await browser.close();
  console.log('TOTAL ERRORS:', totalErrors);
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
