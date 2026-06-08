/**
 * Feste, echte Vereinslogo-URLs (TheSportsDB-CDN). Bilder laden cross-origin ohne
 * CORS-Problem und ohne API-Rate-Limit – daher zeigen alle Wappen sofort echte Logos.
 * Quelle: einmalig via scripts/fetch-badges.js geholt.
 */
export const BADGE_URL: Record<string, string> = {
  bayern: 'https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png',
  dortmund: 'https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png',
  leverkusen: 'https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png',
  stuttgart: 'https://r2.thesportsdb.com/images/media/team/badge/yppyux1473454085.png',
  leipzig: 'https://r2.thesportsdb.com/images/media/team/badge/zjgapo1594244951.png',
  wolfsburg: 'https://r2.thesportsdb.com/images/media/team/badge/pm6wxs1685783759.png',
  frankfurt: 'https://r2.thesportsdb.com/images/media/team/badge/rurwpy1473453269.png',
  liverpool: 'https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png',
  mancity: 'https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png',
  arsenal: 'https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png',
  astonvilla: 'https://r2.thesportsdb.com/images/media/team/badge/jykrpv1717309891.png',
  realmadrid: 'https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png',
  barcelona: 'https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png',
  atletico: 'https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png',
  lakers: 'https://r2.thesportsdb.com/images/media/team/badge/d8uoxw1714254511.png',
  celtics: 'https://r2.thesportsdb.com/images/media/team/badge/4j85bn1667936589.png',
  warriors: 'https://www.thesportsdb.com/images/media/team/badge/xokycb1778197905.png',
  nuggets: 'https://www.thesportsdb.com/images/media/team/badge/s8ch7m1778197814.png',
  chiefs: 'https://r2.thesportsdb.com/images/media/team/badge/936t161515847222.png',
  eagles: 'https://r2.thesportsdb.com/images/media/team/badge/pnpybf1515852421.png',
  niners: 'https://r2.thesportsdb.com/images/media/team/badge/bqbtg61539537328.png',
  bills: 'https://r2.thesportsdb.com/images/media/team/badge/6pb37b1515849026.png',
  cowboys: 'https://r2.thesportsdb.com/images/media/team/badge/wrxssu1450018209.png',
  ravens: 'https://r2.thesportsdb.com/images/media/team/badge/einz3p1546172463.png',
};

export function badgeUrl(teamId?: string): string | undefined {
  return teamId ? BADGE_URL[teamId] : undefined;
}
