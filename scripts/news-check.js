// Prüft im echten Browser, ob echte Vereins-News laden (Marker "NEWS ·" vs "TOP NEWS").
const { chromium } = require('playwright-core');
const URL = process.argv[2] || 'http://localhost:8081/';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
  const proxyHits = [];
  page.on('response', (r) => {
    const u = r.url();
    if (u.includes('corsproxy') || u.includes('allorigins') || u.includes('codetabs') || u.includes('thingproxy'))
      proxyHits.push(`${r.status()} ${u.split('?')[0]}`);
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3500);
  async function click(t) { const e = page.getByText(t, { exact: false }).first(); if (await e.count()) { await e.click().catch(()=>{}); await page.waitForTimeout(500); } }
  if (await page.getByText('Welche Sportarten?', { exact: false }).count()) {
    await click('Fußball'); await click('Weiter'); await click('FC Bayern München'); await click('Weiter'); await click('Fertig');
  }
  await page.waitForTimeout(10000); // News-Fetch abwarten
  const body = await page.locator('body').innerText().catch(() => '');
  const real = body.includes('NEWS ·');
  console.log('ECHTE NEWS GELADEN:', real);
  console.log('Proxy-Responses:', proxyHits.length ? proxyHits.join(' | ') : 'keine');
  // Zeige den News-Abschnitt
  const idx = body.indexOf(real ? 'NEWS ·' : 'TOP NEWS');
  console.log('Abschnitt:', body.slice(idx, idx + 160).replace(/\n+/g, ' | '));
  await page.screenshot({ path: 'scripts/news.png', fullPage: true });

  // --- News-TAB öffnen und auf echte Schlagzeilen prüfen ---
  const tab = page.getByText('Meine News', { exact: true }).last();
  if (await tab.count()) { await tab.click().catch(() => {}); }
  await page.waitForTimeout(8000);
  const tabBody = await page.locator('body').innerText().catch(() => '');
  console.log('--- News-Tab ---');
  console.log('Ueberschrift "Meine News":', tabBody.includes('Meine News'));
  console.log('Live-Zeitstempel (vor ... Min/Std/Tg):', /vor \d+\s*(Min|Std|Tg)/.test(tabBody));
  await page.screenshot({ path: 'scripts/news-tab.png', fullPage: true });
  await browser.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
