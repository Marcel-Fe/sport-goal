import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Crest from '@/components/Crest';
import { EventRow, NewsCompact, StandingsTable } from '@/components/cards';
import { Card, SectionHeader } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import { EVENTS, SPORT_CONFIG, newsForTeam, standingsForLeague } from '@/data/mock';
import { getTeam } from '@/data/teams';

export default function TeamProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = getTeam(id);

  if (!team) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Team nicht gefunden.</Text>
      </SafeAreaView>
    );
  }

  const standings = standingsForLeague(team.league);
  const standing = standings.find((s) => s.teamId === team.id);
  const cfg = SPORT_CONFIG[team.sport];
  const news = newsForTeam(team.id);
  const events = EVENTS.filter((e) => e.teamId === team.id || e.opponentId === team.id);
  const [c1] = team.colors;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {team.name}
        </Text>
        <Ionicons name="star-outline" size={24} color={C.gold} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: c1 + '22', borderColor: c1 + '55' }]}>
          <Crest teamId={team.id} size={72} />
          <Text style={styles.name}>{team.name}</Text>
          {team.motto ? <Text style={styles.motto}>{team.motto}</Text> : null}
          <Text style={styles.league}>{team.league}{team.city ? ` · ${team.city}` : ''}</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Platz" value={standing ? `${standing.pos}.` : '–'} />
          <Stat label="Punkte" value={standing ? `${standing.points}` : '–'} />
          <Stat label="Spiele" value={standing ? `${standing.played}` : '–'} />
        </View>

        {news.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="NEWS" actionLabel={null} />
            <Card>
              <View style={{ gap: S.md }}>
                {news.map((n) => (
                  <NewsCompact key={n.id} item={n} />
                ))}
              </View>
            </Card>
          </View>
        )}

        {events.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={cfg.eventsTitle} actionLabel={null} />
            <Card>
              {events.map((e, i) => (
                <View key={e.id}>
                  {i > 0 ? <View style={styles.rowDivider} /> : null}
                  <EventRow item={e} />
                </View>
              ))}
            </Card>
          </View>
        )}

        {standing && (
          <View style={styles.section}>
            <SectionHeader title={cfg.standingsTitle} actionLabel={null} />
            <Card>
              <StandingsTable rows={standings} highlightId={team.id} col1={cfg.col1} col2={cfg.col2} />
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  missing: { color: C.textDim, textAlign: 'center', marginTop: S.xxl },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    gap: S.md,
  },
  topTitle: { flex: 1, color: C.text, fontSize: F.h3, fontWeight: '800' },
  scroll: { padding: S.lg, gap: S.lg, paddingBottom: S.xxl },
  banner: {
    alignItems: 'center',
    borderRadius: R.xl,
    borderWidth: 1,
    paddingVertical: S.xl,
    gap: S.sm,
  },
  name: { color: C.text, fontSize: F.h2, fontWeight: '900', textAlign: 'center' },
  motto: { color: C.textDim, fontSize: F.small, fontStyle: 'italic' },
  league: { color: C.textFaint, fontSize: F.small, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: S.md },
  stat: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: S.lg,
    alignItems: 'center',
  },
  statValue: { color: C.text, fontSize: F.h2, fontWeight: '900' },
  statLabel: { color: C.textDim, fontSize: F.small, marginTop: 2 },
  section: { gap: 0 },
  rowDivider: { height: 1, backgroundColor: C.borderSoft },
});
