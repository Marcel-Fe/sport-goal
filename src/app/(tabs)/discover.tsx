import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Crest from '@/components/Crest';
import { Chip } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import { SPORTS, TEAMS, type Sport } from '@/data/teams';

export default function Discover() {
  const [sport, setSport] = useState<Sport | 'all'>('all');
  const teams = Object.values(TEAMS).filter((t) => sport === 'all' || t.sport === sport);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.h1}>Entdecken</Text>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Teams, Spieler, Wettbewerbe…</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip label="Alle" selected={sport === 'all'} onPress={() => setSport('all')} />
        {SPORTS.map((s) => (
          <Chip
            key={s.id}
            label={`${s.icon} ${s.label}`}
            selected={sport === s.id}
            onPress={() => setSport(s.id)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {teams.map((t) => (
          <Pressable key={t.id} style={styles.tile} onPress={() => router.push(`/team/${t.id}`)}>
            <Crest teamId={t.id} size={48} />
            <Text style={styles.tileName} numberOfLines={2}>
              {t.name}
            </Text>
            <Text style={styles.tileLeague}>{t.league}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { color: C.text, fontSize: F.h1, fontWeight: '900', paddingHorizontal: S.lg, paddingTop: S.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.surfaceAlt,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    marginHorizontal: S.lg,
    marginTop: S.md,
  },
  searchIcon: { fontSize: 15 },
  searchPlaceholder: { color: C.textFaint, fontSize: F.body },
  chips: { gap: S.sm, paddingHorizontal: S.lg, paddingVertical: S.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: S.md,
    paddingHorizontal: S.lg,
    paddingBottom: S.xxl,
  },
  tile: {
    width: '47.5%',
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.lg,
    alignItems: 'center',
    gap: 6,
  },
  tileName: { color: C.text, fontSize: F.small, fontWeight: '800', textAlign: 'center' },
  tileLeague: { color: C.textFaint, fontSize: F.tiny },
});
