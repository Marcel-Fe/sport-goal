// Holt die TheSportsDB-Team-IDs (idTeam) je Team → src/data/team-ids.ts.
// Damit kann die App eventslast.php?id=<idTeam> nutzen (teamspezifische letzte Spiele),
// ohne Live-searchteams (kein Rate-Limit).
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
      if (t && t.idTeam) map[teamId] = t.idTeam;
      else console.error('no id:', teamId);
    } catch (e) { console.error('err', teamId, e.message); }
    await sleep(600);
  }
  const body = Object.entries(map).map(([k, v]) => `  ${k}: '${v}',`).join('\n');
  const out =
    `/**\n` +
    ` * Feste TheSportsDB-Team-IDs (idTeam) je Team. Für eventslast.php?id=<id>\n` +
    ` * (teamspezifische letzte Spiele) – einmalig via scripts/fetch-team-ids.js geholt.\n` +
    ` */\n` +
    `export const TEAM_DB_ID: Record<string, string> = {\n${body}\n};\n\n` +
    `export function teamDbId(teamId?: string): string | undefined {\n` +
    `  return teamId ? TEAM_DB_ID[teamId] : undefined;\n` +
    `}\n`;
  fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'data', 'team-ids.ts'), out);
  console.log('FOUND', Object.keys(map).length, 'of', Object.keys(API_TEAM_NAME).length);
})();
