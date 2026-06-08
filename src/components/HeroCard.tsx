/**
 * Große Hero-Karte des Lieblingsvereins (oben im Dashboard).
 * Satter Verlauf in Vereinsfarbe, Lichtschein + Glow hinter dem Wappen,
 * dunkler Scrim links für lesbaren Text, Info-Kacheln mit Icons.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import RemoteBadge from '@/components/RemoteBadge';
import Crest from '@/components/Crest';
import { C, F, GLOW, R, S, SHADOW } from '@/constants/tokens';
import { heroTilesFor, standingsForLeague, type HeroTile } from '@/data/mock';
import { getTeam } from '@/data/teams';

/** Mischt eine Hex-Farbe Richtung Weiß (amt>0) oder Schwarz (amt<0). */
function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function Tile({ tile }: { tile: HeroTile }) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileIcon}>
        {tile.iconTeamId ? (
          <Crest teamId={tile.iconTeamId} size={20} />
        ) : (
          <Text style={[styles.tileEmoji, tile.danger && { color: C.accent }]}>{tile.icon}</Text>
        )}
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>{tile.label}</Text>
      <Text style={styles.tileValue} numberOfLines={1}>{tile.value}</Text>
      {tile.sub ? <Text style={styles.tileSub} numberOfLines={1}>{tile.sub}</Text> : null}
    </View>
  );
}

export default function HeroCard({
  teamId,
  badgeUri,
  rank,
  points,
}: {
  teamId: string;
  badgeUri?: string;
  rank?: number;
  points?: number;
}) {
  const team = getTeam(teamId);
  if (!team) return null;

  const mockStanding = standingsForLeague(team.league).find((s) => s.teamId === teamId);
  const pos = rank ?? mockStanding?.pos;
  const pts = points ?? mockStanding?.points;
  const standing = pos != null ? { pos, points: pts ?? 0 } : undefined;
  const tiles = heroTilesFor(teamId);

  const [c1] = team.colors;
  const bright = shade(c1, 0.18);
  const dark = shade(c1, -0.55);

  return (
    <View style={[styles.wrap, SHADOW]}>
      <View style={styles.heroBox}>
        {/* 1) Basis-Verlauf in Vereinsfarbe */}
        <LinearGradient
          colors={[bright, c1, dark]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* 2) Lichtschein oben rechts (Stadion-Stimmung) */}
        <LinearGradient
          colors={['rgba(255,255,255,0.30)', 'rgba(255,255,255,0.0)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 0.9 }}
          style={StyleSheet.absoluteFill}
        />
        {/* 3) Dunkler Scrim links für lesbaren Text */}
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.10)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            {team.motto ? <Text style={styles.motto}>{team.motto.toUpperCase()}</Text> : null}
            <Text style={styles.name}>{team.name}</Text>
            {standing ? (
              <View style={styles.posRow}>
                <Text style={styles.trophy}>🏆</Text>
                <Text style={styles.subline}>
                  {standing.pos}. Platz – {team.league}
                </Text>
                <View style={styles.dot} />
                <Text style={styles.points}>{standing.points} Punkte</Text>
              </View>
            ) : (
              <Text style={styles.subline}>{team.league}</Text>
            )}

            <Pressable style={styles.cta} onPress={() => router.push(`/team/${team.id}`)}>
              <Text style={styles.ctaText}>Zum Teamprofil  ›</Text>
            </Pressable>
          </View>

          {/* Wappen mit rotem Glow (echtes Logo, sonst Platzhalter) */}
          <View style={styles.crestWrap}>
            <View style={[styles.glow, GLOW]} />
            {badgeUri ? (
              <RemoteBadge uri={badgeUri} size={88} />
            ) : (
              <Crest teamId={team.id} size={88} />
            )}
          </View>
        </View>
      </View>

      {/* Info-Kacheln (datengetrieben pro Team/Sportart) */}
      <View style={styles.tiles}>
        {tiles.map((t, i) => (
          <Tile key={i} tile={t} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: R.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  heroBox: { overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', gap: S.lg, padding: S.xl },
  motto: { color: 'rgba(255,255,255,0.92)', fontSize: F.small, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  name: { color: '#FFFFFF', fontSize: F.h1, fontWeight: '900', lineHeight: 34, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
  posRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10, flexWrap: 'wrap' },
  trophy: { fontSize: 14 },
  subline: { color: 'rgba(255,255,255,0.95)', fontSize: F.small, fontWeight: '700' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' },
  points: { color: '#FFFFFF', fontSize: F.small, fontWeight: '900' },
  cta: {
    alignSelf: 'flex-start',
    marginTop: S.lg,
    backgroundColor: C.accent,
    paddingHorizontal: S.xl,
    paddingVertical: S.md,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    ...SHADOW,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: F.small, letterSpacing: 0.3 },
  crestWrap: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.accentGlow,
  },
  tiles: { flexDirection: 'row', backgroundColor: C.surfaceAlt },
  tile: {
    flex: 1,
    paddingVertical: S.md,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: C.border,
    alignItems: 'center',
    gap: 3,
  },
  tileIcon: { height: 22, alignItems: 'center', justifyContent: 'center' },
  tileEmoji: { fontSize: 16 },
  tileLabel: { color: C.textFaint, fontSize: 9, fontWeight: '800', letterSpacing: 0.4, textAlign: 'center' },
  tileValue: { color: C.text, fontSize: F.small, fontWeight: '800' },
  tileSub: { color: C.textDim, fontSize: 10 },
});
