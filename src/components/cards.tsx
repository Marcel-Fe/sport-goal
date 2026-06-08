/**
 * Karten- und Zeilen-Komponenten für die Dashboard-Sektionen.
 * Thumbnails sind farbige Platzhalter (keine geschützten Bilder/Logos).
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Crest from '@/components/Crest';
import { LiveDot, ProgressBar, StatusBadge, statusColor } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import type {
  LiveEvent,
  Match,
  NewsItem,
  ShortClip,
  StandingRow,
  Transfer,
  TrendingTopic,
  UpcomingEvent,
  VideoItem,
} from '@/data/mock';
import { getTeam } from '@/data/teams';

function Thumb({ teamId, height = 80, width }: { teamId: string; height?: number; width?: number }) {
  const team = getTeam(teamId);
  const [c1] = team?.colors ?? ['#22304A'];
  return (
    <View style={[styles.thumb, { height, width, backgroundColor: c1 + '33' }]}>
      <Crest teamId={teamId} size={Math.min(height, width ?? height) * 0.5} />
    </View>
  );
}

function PlayBadge({ duration }: { duration: string }) {
  return (
    <View style={styles.durationBadge}>
      <Text style={styles.durationText}>▶ {duration}</Text>
    </View>
  );
}

// ----------------------------------------------------------- NEWS
export function NewsFeatured({ item }: { item: NewsItem }) {
  return (
    <Pressable style={styles.featured} onPress={() => router.push(`/news/${item.id}`)}>
      <Thumb teamId={item.teamId} height={150} />
      <View style={styles.featuredBody}>
        {item.badge ? (
          <View style={styles.newsBadge}>
            <Text style={styles.newsBadgeText}>{item.badge}</Text>
          </View>
        ) : null}
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSummary} numberOfLines={2}>
          {item.summary}
        </Text>
      </View>
    </Pressable>
  );
}

export function NewsCompact({ item }: { item: NewsItem }) {
  return (
    <Pressable style={styles.compactRow} onPress={() => router.push(`/news/${item.id}`)}>
      <Thumb teamId={item.teamId} height={56} width={56} />
      <View style={{ flex: 1 }}>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        <Text style={styles.compactTitle} numberOfLines={3}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
}

// ----------------------------------------------------------- VIDEO
export function VideoFeatured({ item }: { item: VideoItem }) {
  return (
    <Pressable style={styles.featured}>
      <View>
        <Thumb teamId={item.teamId} height={150} />
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <PlayBadge duration={item.duration} />
      </View>
      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.timeAgo}>
          {item.timeAgo} · {item.source}
        </Text>
      </View>
    </Pressable>
  );
}

export function VideoCompact({ item }: { item: VideoItem }) {
  return (
    <Pressable style={styles.compactRow}>
      <View>
        <Thumb teamId={item.teamId} height={56} width={84} />
        <PlayBadge duration={item.duration} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.compactTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.timeAgo}>{item.source}</Text>
      </View>
    </Pressable>
  );
}

// ----------------------------------------------------------- SHORTS
export function ShortCard({ item }: { item: ShortClip }) {
  return (
    <Pressable style={styles.short}>
      <Thumb teamId={item.teamId} height={150} width={108} />
      <View style={styles.shortOverlayTop}>
        <PlayBadge duration={item.duration} />
      </View>
      <View style={styles.shortOverlay}>
        <Text style={styles.shortTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.shortViews}>{item.views} Aufrufe</Text>
      </View>
    </Pressable>
  );
}

// ----------------------------------------------------------- TRANSFER
export function TransferRow({ item }: { item: Transfer }) {
  const to = getTeam(item.toTeamId);
  const from = getTeam(item.fromTeamId);
  const moving = item.fromTeamId !== item.toTeamId;
  return (
    <View style={styles.transferRow}>
      <Crest teamId={item.toTeamId} size={36} />
      <View style={{ flex: 1 }}>
        <Text style={styles.transferPlayer}>{item.player}</Text>
        <Text style={styles.timeAgo}>
          {moving ? `${from?.initials} → ${to?.initials}` : `Verlängerung · ${to?.initials}`}
        </Text>
        <View style={{ marginTop: 6 }}>
          <ProgressBar value={item.probability} color={statusColor(item.status)} />
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <StatusBadge status={item.status} />
        <Text style={styles.prob}>{item.probability}%</Text>
      </View>
    </View>
  );
}

// ----------------------------------------------------------- LIVE
export function LiveRow({ item }: { item: LiveEvent }) {
  const home = getTeam(item.homeId);
  const away = getTeam(item.awayId);
  return (
    <View style={styles.liveRow}>
      <View style={styles.liveComp}>
        <Text style={styles.liveCompText} numberOfLines={1}>
          {item.competition}
        </Text>
        <Text style={styles.liveClock}>{item.clock}</Text>
      </View>
      <View style={styles.liveTeams}>
        <View style={styles.liveTeam}>
          <Crest teamId={item.homeId} size={22} />
          <Text style={styles.liveTeamName} numberOfLines={1}>
            {home?.initials}
          </Text>
          <Text style={styles.liveScore}>{item.homeScore}</Text>
        </View>
        <View style={styles.liveTeam}>
          <Crest teamId={item.awayId} size={22} />
          <Text style={styles.liveTeamName} numberOfLines={1}>
            {away?.initials}
          </Text>
          <Text style={styles.liveScore}>{item.awayScore}</Text>
        </View>
      </View>
    </View>
  );
}

// ----------------------------------------------------------- TRENDING
export function TrendingRow({ item }: { item: TrendingTopic }) {
  return (
    <View style={styles.trendingRow}>
      <Text style={styles.trendRank}>{item.rank}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.trendTag}>{item.tag}</Text>
        <Text style={styles.timeAgo}>{item.posts}</Text>
      </View>
      <Text style={[styles.trendArrow, { color: item.trend === 'up' ? C.green : C.red }]}>
        {item.trend === 'up' ? '↗' : '↘'}
      </Text>
    </View>
  );
}

// ----------------------------------------------------------- MATCH
export function MatchRow({ item }: { item: Match }) {
  const home = getTeam(item.homeId);
  const away = getTeam(item.awayId);
  return (
    <View style={styles.matchRow}>
      <View style={styles.matchDate}>
        <Text style={styles.matchDateText}>{item.dateLabel}</Text>
        <Text style={styles.matchTimeText}>{item.timeLabel}</Text>
      </View>
      <View style={styles.matchTeams}>
        <View style={styles.matchTeamLine}>
          <Crest teamId={item.homeId} size={20} />
          <Text style={styles.matchTeamName} numberOfLines={1}>
            {home?.name}
          </Text>
        </View>
        <View style={styles.matchTeamLine}>
          <Crest teamId={item.awayId} size={20} />
          <Text style={styles.matchTeamName} numberOfLines={1}>
            {away?.name}
          </Text>
        </View>
        <Text style={styles.matchComp}>{item.competition}</Text>
      </View>
      <Text style={styles.bell}>🔔</Text>
    </View>
  );
}

// ----------------------------------------------------------- EVENT (Spiel/Rennen/Turnier)
export function EventRow({ item }: { item: UpcomingEvent }) {
  const team = getTeam(item.teamId);
  const opp = item.opponentId ? getTeam(item.opponentId) : undefined;
  return (
    <View style={styles.matchRow}>
      <View style={styles.matchDate}>
        <Text style={styles.matchDateText}>{item.dateLabel}</Text>
        <Text style={styles.matchTimeText}>{item.timeLabel}</Text>
      </View>
      <View style={styles.matchTeams}>
        {opp ? (
          <>
            <View style={styles.matchTeamLine}>
              <Crest teamId={item.teamId} size={20} />
              <Text style={styles.matchTeamName} numberOfLines={1}>{team?.name}</Text>
            </View>
            <View style={styles.matchTeamLine}>
              <Crest teamId={item.opponentId!} size={20} />
              <Text style={styles.matchTeamName} numberOfLines={1}>{opp.name}</Text>
            </View>
          </>
        ) : (
          <View style={styles.matchTeamLine}>
            <Crest teamId={item.teamId} size={20} />
            <Text style={styles.matchTeamName} numberOfLines={1}>{item.title}</Text>
          </View>
        )}
        <Text style={styles.matchComp}>{item.sub}</Text>
      </View>
      <Text style={styles.bell}>🔔</Text>
    </View>
  );
}

// ----------------------------------------------------------- STANDINGS
export function StandingsTable({
  rows,
  highlightId,
  col1 = 'SP',
  col2 = 'PKT',
}: {
  rows: StandingRow[];
  highlightId?: string;
  col1?: string;
  col2?: string;
}) {
  return (
    <View>
      <View style={styles.tableHead}>
        <Text style={[styles.th, { width: 24 }]}>#</Text>
        <Text style={[styles.th, { flex: 1 }]}>TEAM</Text>
        <Text style={[styles.th, styles.thNum]}>{col1}</Text>
        <Text style={[styles.th, styles.thNum]}>{col2}</Text>
      </View>
      {rows.map((row) => {
        const team = getTeam(row.teamId);
        const hl = row.teamId === highlightId;
        return (
          <View key={row.teamId} style={[styles.tableRow, hl && styles.tableRowHl]}>
            <Text style={[styles.td, { width: 24 }, hl && styles.tdHl]}>{row.pos}</Text>
            <View style={styles.tableTeam}>
              <Crest teamId={row.teamId} size={22} />
              <Text style={[styles.tableTeamName, hl && styles.tdHl]} numberOfLines={1}>
                {team?.name}
              </Text>
            </View>
            <Text style={[styles.td, styles.thNum]}>{row.played}</Text>
            <Text style={[styles.td, styles.thNum, styles.tdBold, hl && styles.tdHl]}>{row.points}</Text>
          </View>
        );
      })}
    </View>
  );
}

export { LiveDot };

const styles = StyleSheet.create({
  thumb: {
    width: '100%',
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 52,
    height: 52,
    borderRadius: 26,
    textAlign: 'center',
    lineHeight: 52,
    overflow: 'hidden',
  },
  timeAgo: { color: C.textFaint, fontSize: F.tiny, fontWeight: '600', marginTop: 2 },

  featured: { gap: S.md },
  featuredBody: { gap: 4 },
  newsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 2,
  },
  newsBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  featuredTitle: { color: C.text, fontSize: F.h3, fontWeight: '800', lineHeight: 23 },
  featuredSummary: { color: C.textDim, fontSize: F.small, lineHeight: 18 },

  compactRow: { flexDirection: 'row', gap: S.md, alignItems: 'center' },
  compactTitle: { color: C.text, fontSize: F.small, fontWeight: '700', lineHeight: 18 },

  short: {
    width: 108,
    borderRadius: R.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  shortOverlayTop: { position: 'absolute', top: 0, right: 0 },
  shortOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  shortTitle: { color: '#FFFFFF', fontSize: F.tiny, fontWeight: '800', lineHeight: 14 },
  shortViews: { color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 2 },

  transferRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  transferPlayer: { color: C.text, fontSize: F.body, fontWeight: '800' },
  prob: { color: C.textDim, fontSize: F.tiny, fontWeight: '700' },

  liveRow: {
    paddingVertical: S.sm,
    borderTopWidth: 1,
    borderTopColor: C.borderSoft,
  },
  liveComp: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  liveCompText: { color: C.textDim, fontSize: F.tiny, fontWeight: '700', flex: 1 },
  liveClock: { color: C.live, fontSize: F.tiny, fontWeight: '800' },
  liveTeams: { gap: 6 },
  liveTeam: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveTeamName: { color: C.text, fontSize: F.small, fontWeight: '700', flex: 1 },
  liveScore: { color: C.text, fontSize: F.small, fontWeight: '900' },

  trendingRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  trendRank: { color: C.textFaint, fontSize: F.h3, fontWeight: '900', width: 22 },
  trendTag: { color: C.text, fontSize: F.body, fontWeight: '800' },
  trendArrow: { fontSize: F.h3, fontWeight: '900' },

  matchRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  matchDate: { width: 52 },
  matchDateText: { color: C.text, fontSize: F.small, fontWeight: '800' },
  matchTimeText: { color: C.textDim, fontSize: F.tiny },
  matchTeams: { flex: 1, gap: 3 },
  matchTeamLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchTeamName: { color: C.text, fontSize: F.small, fontWeight: '600', flex: 1 },
  matchComp: { color: C.textFaint, fontSize: F.tiny, marginTop: 2 },
  bell: { fontSize: 16 },

  tableHead: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8 },
  th: { color: C.textFaint, fontSize: F.tiny, fontWeight: '800', letterSpacing: 0.5 },
  thNum: { width: 36, textAlign: 'right' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.borderSoft,
  },
  tableRowHl: { backgroundColor: C.accentSoft, borderRadius: R.sm },
  td: { color: C.textDim, fontSize: F.small, fontWeight: '600' },
  tdBold: { fontWeight: '900', color: C.text },
  tdHl: { color: C.text, fontWeight: '900' },
  tableTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tableTeamName: { color: C.text, fontSize: F.small, fontWeight: '700', flex: 1 },
});
