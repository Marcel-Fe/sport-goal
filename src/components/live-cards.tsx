/**
 * Render-Komponenten für ECHTE Live-Daten (TheSportsDB):
 * Tabelle, letzte Ergebnisse, nächste Spiele und Highlight-Videos (Bild + Link).
 */
import { Image } from 'expo-image';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import Crest from '@/components/Crest';
import RemoteBadge from '@/components/RemoteBadge';
import { C, F, R, S } from '@/constants/tokens';
import { sameTeam, type LiveMatch, type LiveStanding } from '@/data/live';
import { fanartUrl } from '@/data/images-static';
import type { NewsHeadline } from '@/data/news';

function openUrl(url?: string) {
  if (url) Linking.openURL(url).catch(() => {});
}

// ------------------------------------------------------- Echte News (Schlagzeile, Anzeige)
export function LiveNewsFeatured({ item, teamId }: { item: NewsHeadline; teamId: string }) {
  const fanart = fanartUrl(teamId);
  return (
    <View style={styles.newsFeatured}>
      <View style={styles.newsHero}>
        {fanart ? (
          <Image
            source={{ uri: fanart }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
        ) : null}
        {fanart ? <View style={styles.newsHeroScrim} /> : null}
        <Crest teamId={teamId} size={64} />
      </View>
      <View style={styles.newsSourceRow}>
        <Text style={styles.newsSource}>{item.source}</Text>
        <Text style={styles.newsAgo}>· {item.ago}</Text>
      </View>
      <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
    </View>
  );
}

export function LiveNewsRow({ item, teamId }: { item: NewsHeadline; teamId: string }) {
  return (
    <View style={styles.newsRow}>
      <Crest teamId={teamId} size={44} />
      <View style={{ flex: 1 }}>
        <View style={styles.newsSourceRow}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Text style={styles.newsAgo}>· {item.ago}</Text>
        </View>
        <Text style={styles.newsRowTitle} numberOfLines={3}>{item.title}</Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------- Tabelle (live)
export function LiveStandingsTable({
  rows,
  highlightApiName,
  col1 = 'SP',
  col2 = 'PKT',
  max = 6,
}: {
  rows: LiveStanding[];
  highlightApiName?: string;
  col1?: string;
  col2?: string;
  max?: number;
}) {
  return (
    <View>
      <View style={styles.tableHead}>
        <Text style={[styles.th, { width: 24 }]}>#</Text>
        <Text style={[styles.th, { flex: 1 }]}>TEAM</Text>
        <Text style={[styles.th, styles.thNum]}>{col1}</Text>
        <Text style={[styles.th, styles.thNum]}>{col2}</Text>
      </View>
      {rows.slice(0, max).map((row) => {
        const hl = sameTeam(row.name, highlightApiName);
        return (
          <View key={row.rank} style={[styles.tableRow, hl && styles.tableRowHl]}>
            <Text style={[styles.td, { width: 24 }, hl && styles.tdHl]}>{row.rank}</Text>
            <View style={styles.tableTeam}>
              <RemoteBadge uri={row.badge} fallbackInitials={row.name} size={22} />
              <Text style={[styles.tableTeamName, hl && styles.tdHl]} numberOfLines={1}>
                {row.name}
              </Text>
            </View>
            <Text style={[styles.td, styles.thNum]}>{row.played}</Text>
            <Text style={[styles.td, styles.thNum, styles.tdBold, hl && styles.tdHl]}>
              {row.points}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ------------------------------------------------------- Ergebnis (live)
export function LiveResultRow({ item }: { item: LiveMatch }) {
  const hasVideo = !!item.video;
  const single = !item.home;
  return (
    <Pressable style={styles.result} disabled={!hasVideo} onPress={() => openUrl(item.video)}>
      <View style={styles.resultDate}>
        <Text style={styles.resultDateText}>{item.dateLabel}</Text>
        {hasVideo ? <Text style={styles.playMini}>▶</Text> : null}
      </View>
      {single ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.teamName} numberOfLines={2}>{item.event}</Text>
          <Text style={styles.eventSub}>{item.league}</Text>
        </View>
      ) : (
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.teamLine}>
            <RemoteBadge uri={item.homeBadge} fallbackInitials={item.home} size={20} />
            <Text style={styles.teamName} numberOfLines={1}>{item.home}</Text>
            <Text style={styles.score}>{item.homeScore ?? '–'}</Text>
          </View>
          <View style={styles.teamLine}>
            <RemoteBadge uri={item.awayBadge} fallbackInitials={item.away} size={20} />
            <Text style={styles.teamName} numberOfLines={1}>{item.away}</Text>
            <Text style={styles.score}>{item.awayScore ?? '–'}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ------------------------------------------------------- Fixture (live)
export function LiveFixtureRow({ item }: { item: LiveMatch }) {
  const single = !item.home;
  return (
    <View style={styles.result}>
      <View style={styles.resultDate}>
        <Text style={styles.resultDateText}>{item.dateLabel}</Text>
        <Text style={styles.resultTime}>{item.timeLabel}</Text>
      </View>
      {single ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.teamName} numberOfLines={2}>{item.event}</Text>
          <Text style={styles.eventSub}>{item.league}</Text>
        </View>
      ) : (
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.teamLine}>
            <RemoteBadge uri={item.homeBadge} fallbackInitials={item.home} size={20} />
            <Text style={styles.teamName} numberOfLines={1}>{item.home}</Text>
          </View>
          <View style={styles.teamLine}>
            <RemoteBadge uri={item.awayBadge} fallbackInitials={item.away} size={20} />
            <Text style={styles.teamName} numberOfLines={1}>{item.away}</Text>
          </View>
        </View>
      )}
      <Text style={styles.bell}>🔔</Text>
    </View>
  );
}

// ------------------------------------------------------- Highlight-Video (Bild + Link)
export function LiveVideoCard({ item }: { item: LiveMatch }) {
  return (
    <Pressable style={styles.video} onPress={() => openUrl(item.video)}>
      <View style={styles.videoThumb}>
        {item.thumb ? (
          <Image source={{ uri: item.thumb }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: C.surfaceElevated }]} />
        )}
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <Text style={styles.videoTitle} numberOfLines={2}>
        {item.home ? `${item.home} vs ${item.away}` : item.event}
      </Text>
      <Text style={styles.videoSub}>Highlights · {item.league}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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

  result: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  resultDate: { width: 46, alignItems: 'center' },
  resultDateText: { color: C.text, fontSize: F.small, fontWeight: '800' },
  resultTime: { color: C.textDim, fontSize: F.tiny },
  playMini: { color: C.accent, fontSize: 11, marginTop: 2 },
  teamLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  teamName: { color: C.text, fontSize: F.small, fontWeight: '700', flex: 1 },
  eventSub: { color: C.textFaint, fontSize: F.tiny, marginTop: 2 },
  score: { color: C.text, fontSize: F.small, fontWeight: '900', minWidth: 18, textAlign: 'right' },
  bell: { fontSize: 16 },

  video: { width: 200, gap: 6 },
  videoThumb: {
    width: '100%',
    height: 112,
    borderRadius: R.md,
    overflow: 'hidden',
    backgroundColor: C.surfaceElevated,
  },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    borderRadius: 24,
    textAlign: 'center',
    lineHeight: 48,
    overflow: 'hidden',
  },
  videoTitle: { color: C.text, fontSize: F.small, fontWeight: '800', lineHeight: 18 },
  videoSub: { color: C.textFaint, fontSize: F.tiny },

  newsFeatured: { gap: 6 },
  newsHero: {
    height: 130,
    borderRadius: R.md,
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  newsHeroScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)' },
  newsSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newsSource: { color: C.accent, fontSize: F.tiny, fontWeight: '800' },
  newsAgo: { color: C.textFaint, fontSize: F.tiny },
  newsTitle: { color: C.text, fontSize: F.h3, fontWeight: '800', lineHeight: 23 },
  newsLink: { color: C.textDim, fontSize: F.small, fontWeight: '700' },
  newsRow: { flexDirection: 'row', gap: S.md, alignItems: 'center' },
  newsRowTitle: { color: C.text, fontSize: F.small, fontWeight: '700', lineHeight: 18, marginTop: 2 },
});
