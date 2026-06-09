// Holt echte, lizenzierte Vereins-Stimmungsbilder (Fanart/Banner) je Team und
// schreibt sie als feste Map nach src/data/images-static.ts (kein Live-searchteams).
const fs = require('fs');
const path = require('path');
const API = 'https://www.thesportsdb.com/api/v1/json/3';
const API_TEAM_NAME = {
  bayern: 'Bayern Munich', dortmund: 'Borussia Dortmund', leverkusen: 'Bayer Leverkusen',
  stuttgart: 'VfB Stuttgart', leipzig: 'RB Leipzig', wolfsburg: 'VfL Wolfsburg', frankfurt: 'Eintracht Frankfurt',
  liverpool: 'Liverpool', mancity: 'Manchester City', arsenal: 'Arsenal', astonvilla: 'Aston Villa',
  realmadrid: 'Real Madrid', barcelona: 'Barcelona', atletico: 'Atletico Madrid',
  lakers: 'Los Angeles Lakers', celtics: 'Boston Celtics', warriors: 'Golden State Warriors', nuggets: 'Denver Nuggets',
  chiefs: 'Kansas City Chiefs', eagles: 'Philadelphia Eagles', niners: 'San Francisco 49ers',
  bills: 'Buffalo Bills', cowboys: 'Dallas Cowboys', ravens: 'Baltimore Ravens',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const map = {};
  for (const [teamId, name] of Object.entries(API_TEAM_NAME)) {
    try {
      const r = await fetch(`${API}/searchteams.php?t=${encodeURIComponent(name)}`);
      const j = await r.json();
      const t = (j.teams || [])[0];
      // bevorzugt Fanart (Stadion/Atmosphäre, Querformat), sonst Banner
      const img = t && (t.strFanart1 || t.strFanart2 || t.strBanner || t.strFanart3 || t.strFanart4);
      if (img) map[teamId] = img;
      else console.error('no image:', teamId);
    } catch (e) { console.error('err', teamId, e.message); }
    await sleep(600);
  }
  const out =
    `/**\n` +
    ` * Feste, lizenzierte Vereins-Stimmungsbilder (TheSportsDB-CDN: Fanart/Banner).\n` +
    ` * Als optischer Header der News-Karten – KEINE geschützten Verlags-Artikelbilder.\n` +
    ` * Quelle: einmalig via scripts/fetch-fanart.js geholt.\n` +
    ` */\n` +
    `export const FANART_URL: Record<string, string> = ${JSON.stringify(map, null, 2)};\n\n` +
    `export function fanartUrl(teamId?: string): string | undefined {\n` +
    `  return teamId ? FANART_URL[teamId] : undefined;\n` +
    `}\n`;
  fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'data', 'images-static.ts'), out);
  console.log('FOUND', Object.keys(map).length, 'of', Object.keys(API_TEAM_NAME).length);
})();
