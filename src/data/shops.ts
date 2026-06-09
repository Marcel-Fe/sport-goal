/**
 * Verknüpfung zum OFFIZIELLEN Fanshop des Vereins (nur ein Link, rechtlich sauber).
 * Direktlinks für geprüfte Shops; sonst zuverlässiger Such-Deeplink zum echten Shop.
 */
import { getTeam } from '@/data/teams';

const SHOP_URL: Record<string, string> = {
  bayern: 'https://fcbayern.com/fanshop/de',
  dortmund: 'https://shop.bvb.de',
  leverkusen: 'https://shop.bayer04.de',
  stuttgart: 'https://shop.vfb.de',
  wolfsburg: 'https://shop.vfl-wolfsburg.de',
  frankfurt: 'https://shop.eintracht.de',
  liverpool: 'https://store.liverpoolfc.com',
  mancity: 'https://shop.mancity.com',
  arsenal: 'https://www.arsenaldirect.arsenal.com',
  realmadrid: 'https://shop.realmadrid.com',
  barcelona: 'https://store.fcbarcelona.com',
  atletico: 'https://store.atleticodemadrid.com',
};

/** Offizieller Fanshop-Link; Fallback = Suche nach dem echten Shop (nie tot). */
export function shopUrl(teamId?: string): string {
  if (teamId && SHOP_URL[teamId]) return SHOP_URL[teamId];
  const name = (teamId && getTeam(teamId)?.name) || 'Sport';
  return `https://www.google.com/search?q=${encodeURIComponent(name + ' official fan shop')}`;
}
