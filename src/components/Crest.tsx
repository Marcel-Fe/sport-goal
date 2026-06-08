/**
 * Einheitliches Wappen: echtes Vereinslogo (feste CDN-URL), sonst Platzhalter.
 * Logos laden cross-origin ohne CORS/Rate-Limit – daher sofort und zuverlässig.
 */
import RemoteBadge from '@/components/RemoteBadge';
import { badgeUrl } from '@/data/badges-static';

export default function Crest({ teamId, size = 40 }: { teamId: string; size?: number }) {
  return <RemoteBadge uri={badgeUrl(teamId)} teamId={teamId} size={size} />;
}
