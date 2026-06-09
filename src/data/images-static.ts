/**
 * Feste, lizenzierte Vereins-Stimmungsbilder (TheSportsDB-CDN: Fanart/Banner).
 * Als optischer Header der News-Karten – KEINE geschützten Verlags-Artikelbilder.
 * Quelle: einmalig via scripts/fetch-fanart.js geholt.
 */
export const FANART_URL: Record<string, string> = {
  "bayern": "https://r2.thesportsdb.com/images/media/team/fanart/09b7u21519406807.jpg",
  "dortmund": "https://r2.thesportsdb.com/images/media/team/fanart/twurvu1424230516.jpg",
  "leverkusen": "https://r2.thesportsdb.com/images/media/team/fanart/trrvyu1424315811.jpg",
  "stuttgart": "https://r2.thesportsdb.com/images/media/team/fanart/yuxsst1424316364.jpg",
  "leipzig": "https://r2.thesportsdb.com/images/media/team/fanart/3ikm6l1543772211.jpg",
  "frankfurt": "https://r2.thesportsdb.com/images/media/team/fanart/uvxpyy1424316870.jpg",
  "liverpool": "https://r2.thesportsdb.com/images/media/team/fanart/uj7bqd1731851977.jpg",
  "mancity": "https://r2.thesportsdb.com/images/media/team/fanart/t7rbvo1731826240.jpg",
  "arsenal": "https://r2.thesportsdb.com/images/media/team/fanart/ouqjzl1769332470.jpg",
  "astonvilla": "https://r2.thesportsdb.com/images/media/team/fanart/p8xxwp1731826441.jpg",
  "realmadrid": "https://r2.thesportsdb.com/images/media/team/fanart/a5kit31731826485.jpg",
  "barcelona": "https://r2.thesportsdb.com/images/media/team/fanart/swqxry1424485326.jpg",
  "atletico": "https://r2.thesportsdb.com/images/media/team/fanart/qwpxxy1420327141.jpg",
  "lakers": "https://r2.thesportsdb.com/images/media/team/fanart/c40roe1590335658.jpg",
  "celtics": "https://r2.thesportsdb.com/images/media/team/fanart/3bbiqw1549272990.jpg",
  "warriors": "https://r2.thesportsdb.com/images/media/team/fanart/wwtwru1421104483.jpg",
  "nuggets": "https://r2.thesportsdb.com/images/media/team/fanart/tvywtt1420850555.jpg",
  "chiefs": "https://r2.thesportsdb.com/images/media/team/fanart/edryqt1548528860.jpg",
  "eagles": "https://r2.thesportsdb.com/images/media/team/fanart/f666rd1517930318.jpg",
  "niners": "https://r2.thesportsdb.com/images/media/team/fanart/jjpe8z1553091942.jpg",
  "bills": "https://r2.thesportsdb.com/images/media/team/fanart/wwtsqs1421272864.jpg",
  "cowboys": "https://r2.thesportsdb.com/images/media/team/fanart/uvwrwv1471814845.jpg",
  "ravens": "https://r2.thesportsdb.com/images/media/team/fanart/xptsvp1421272634.jpg"
};

export function fanartUrl(teamId?: string): string | undefined {
  return teamId ? FANART_URL[teamId] : undefined;
}
