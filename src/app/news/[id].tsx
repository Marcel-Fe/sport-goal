import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Crest from '@/components/Crest';
import Frame from '@/components/Frame';
import { C, F, R, S } from '@/constants/tokens';
import { getNews } from '@/data/mock';
import { getTeam } from '@/data/teams';

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getNews(id);
  const [mode, setMode] = useState<'short' | 'long'>('short');

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Meldung nicht gefunden.</Text>
      </SafeAreaView>
    );
  }

  const team = getTeam(item.teamId);
  const [c1] = team?.colors ?? ['#22304A'];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Frame>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </Pressable>
        <Ionicons name="bookmark-outline" size={22} color={C.textDim} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: c1 + '2A' }]}>
          <Crest teamId={item.teamId} size={64} />
        </View>

        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.source} · {item.timeAgo}
        </Text>

        {/* KI-Zusammenfassung */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>✨ KI-Zusammenfassung</Text>
            <View style={styles.toggle}>
              <Pressable
                onPress={() => setMode('short')}
                style={[styles.toggleBtn, mode === 'short' && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, mode === 'short' && styles.toggleTextActive]}>
                  Kurz · 30s
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('long')}
                style={[styles.toggleBtn, mode === 'long' && styles.toggleActive]}
              >
                <Text style={[styles.toggleText, mode === 'long' && styles.toggleTextActive]}>
                  Lang · 2 Min
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.aiBody}>{mode === 'short' ? item.aiShort : item.aiLong}</Text>
        </View>

        <View style={styles.sourceBtn}>
          <Ionicons name="newspaper-outline" size={18} color={C.textDim} />
          <Text style={styles.sourceText}>Quelle: {item.source}</Text>
        </View>
        <Text style={styles.disclaimer}>
          Diese Zusammenfassung wurde automatisch aus öffentlich verfügbaren Informationen erstellt.
        </Text>
      </ScrollView>
      </Frame>
    </SafeAreaView>
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
  },
  scroll: { padding: S.lg, paddingBottom: S.xxl },
  hero: {
    height: 170,
    borderRadius: R.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: S.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: C.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: S.sm,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  title: { color: C.text, fontSize: F.h1, fontWeight: '900', lineHeight: 34 },
  meta: { color: C.textFaint, fontSize: F.small, marginTop: S.sm, fontWeight: '600' },
  aiCard: {
    marginTop: S.xl,
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.lg,
  },
  aiHeader: { gap: S.md, marginBottom: S.md },
  aiTitle: { color: C.text, fontSize: F.h3, fontWeight: '800' },
  toggle: {
    flexDirection: 'row',
    backgroundColor: C.surfaceAlt,
    borderRadius: R.pill,
    padding: 3,
    alignSelf: 'flex-start',
  },
  toggleBtn: { paddingHorizontal: S.md, paddingVertical: 6, borderRadius: R.pill },
  toggleActive: { backgroundColor: C.accent },
  toggleText: { color: C.textDim, fontSize: F.small, fontWeight: '700' },
  toggleTextActive: { color: C.text },
  aiBody: { color: C.textDim, fontSize: F.body, lineHeight: 23 },
  sourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.surfaceElevated,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.lg,
    marginTop: S.lg,
  },
  sourceText: { color: C.text, fontSize: F.body, fontWeight: '700' },
  disclaimer: { color: C.textFaint, fontSize: F.tiny, marginTop: S.md, lineHeight: 16 },
});
