// Holt echte Logo-URLs je Team per Suche (sequﾟentiell, mit Pause) → teamId→URL-Map.
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
      const t = (j.teams || []).find((x) => x.strBadge) || (j.teams || [])[0];
      if (t && t.strBadge) map[teamId] = t.strBadge.replace('/tiny', '');
      else console.error('no badge:', teamId);
    } catch (e) { console.error('err', teamId, e.message); }
    await sleep(600);
  }
  console.log(JSON.stringify(map, null, 2));
  console.log('FOUND', Object.keys(map).length, 'of', Object.keys(API_TEAM_NAME).length);
})();
