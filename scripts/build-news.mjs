/**
 * Läuft im GitHub-Actions-Cron (serverseitig, kein CORS): holt aktuelle News pro
 * Verein/Fahrer von Google-News-RSS und schreibt sie als feste JSON-Dateien nach
 * dist/news/<id>.json. Die App lädt diese same-origin → immer frisch & zuverlässig.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'dist', 'news');
mkdirSync(OUT, { recursive: true });

const QUERY = {
  bayern: 'FC Bayern München', dortmund: 'Borussia Dortmund', leverkusen: 'Bayer Leverkusen',
  stuttgart: 'VfB Stuttgart', leipzig: 'RB Leipzig', wolfsburg: 'VfL Wolfsburg', frankfurt: 'Eintracht Frankfurt',
  liverpool: 'Liverpool FC', mancity: 'Manchester City', arsenal: 'Arsenal FC', astonvilla: 'Aston Villa',
  realmadrid: 'Real Madrid', barcelona: 'FC Barcelona', atletico: 'Atlético Madrid',
  lakers: 'Los Angeles Lakers', celtics: 'Boston Celtics', warriors: 'Golden State Warriors', nuggets: 'Denver Nuggets',
  chiefs: 'Kansas City Chiefs', eagles: 'Philadelphia Eagles', niners: 'San Francisco 49ers',
  bills: 'Buffalo Bills', cowboys: 'Dallas Cowboys', ravens: 'Baltimore Ravens',
  verstappen: 'Max Verstappen', norris: 'Lando Norris', piastri: 'Oscar Piastri', leclerc: 'Charles Leclerc',
  hamilton: 'Lewis Hamilton', russell: 'George Russell', mercedes: 'Mercedes F1 Team', ferrari: 'Scuderia Ferrari',
  djokovic: 'Novak Djokovic', alcaraz: 'Carlos Alcaraz', sinner: 'Jannik Sinner', medvedev: 'Daniil Medvedev',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dec = (s) =>
  s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
   .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();

function parse(xml) {
  const items = xml.split('<item>').slice(1, 13);
  const out = [];
  for (const raw of items) {
    const title = dec((raw.match(/<title>(.*?)<\/title>/s)?.[1] ?? '').trim());
    const link = dec((raw.match(/<link>(.*?)<\/link>/s)?.[1] ?? '').trim());
    const pubStr = raw.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1] ?? '';
    let src = dec((raw.match(/<source[^>]*>(.*?)<\/source>/s)?.[1] ?? '').trim());
    if (!title || !link) continue;
    let head = title;
    const dash = title.lastIndexOf(' - ');
    if (!src && dash > 0) { src = title.slice(dash + 3); head = title.slice(0, dash); }
    out.push({ title: head, link, source: src || 'Quelle', pub: pubStr ? new Date(pubStr).getTime() : Date.now() });
  }
  return out.slice(0, 10);
}

let ok = 0;
for (const [id, q] of Object.entries(QUERY)) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=de&gl=DE&ceid=DE:de`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 SportGoalBot' } });
    const xml = await res.text();
    const items = parse(xml);
    if (items.length) {
      writeFileSync(resolve(OUT, `${id}.json`), JSON.stringify({ updated: Date.now(), items }));
      ok++;
    } else {
      console.error('leer:', id);
    }
  } catch (e) {
    console.error('fehler:', id, e.message);
  }
  await sleep(300);
}
console.log(`News geschrieben: ${ok}/${Object.keys(QUERY).length}`);
