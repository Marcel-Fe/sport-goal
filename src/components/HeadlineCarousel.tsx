/**
 * Durchklickbares Schlagzeilen-Karussell (Bild-Online-Stil): zeigt die neuesten
 * Schlagzeilen groß, vor/zurück blätterbar + sanftes Auto-Weiterschalten.
 * Legal: nur Schlagzeile + Quelle, kein externer Link, kein Verlagsbild.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, F, R, S } from '@/constants/tokens';
import type { NewsHeadline } from '@/data/news';

export default function HeadlineCarousel({
  items,
  label = 'SCHLAGZEILEN',
}: {
  items: NewsHeadline[];
  label?: string;
}) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;
  const it = items[Math.min(i, n - 1)];
  const go = (d: number) => setI((x) => (x + d + n) % n);

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(226,0,26,0.18)', 'rgba(226,0,26,0.0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.top}>
        <Text style={styles.label}>📰 {label}</Text>
        <Text style={styles.count}>
          {i + 1}/{n}
        </Text>
      </View>

      <Pressable style={styles.body} onPress={() => go(1)}>
        <View style={styles.srcRow}>
          <Text style={styles.src}>{it.source}</Text>
          <Text style={styles.ago}>· {it.ago}</Text>
        </View>
        <Text style={styles.title} numberOfLines={4}>
          {it.title}
        </Text>
      </Pressable>

      <View style={styles.nav}>
        <Pressable style={styles.btn} onPress={() => go(-1)} hitSlop={8}>
          <Text style={styles.btnTxt}>‹ Zurück</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => go(1)} hitSlop={8}>
          <Text style={[styles.btnTxt, styles.btnTxtPrimary]}>Weiter ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceAlt,
    overflow: 'hidden',
    padding: S.lg,
    gap: S.sm,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: C.accent, fontSize: F.tiny, fontWeight: '900', letterSpacing: 0.6 },
  count: { color: C.textFaint, fontSize: F.tiny, fontWeight: '800' },
  body: { minHeight: 96, justifyContent: 'center', gap: 6 },
  srcRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  src: { color: C.accent, fontSize: F.small, fontWeight: '800' },
  ago: { color: C.textFaint, fontSize: F.small },
  title: { color: C.text, fontSize: F.h2, fontWeight: '900', lineHeight: 28 },
  nav: {
    flexDirection: 'row',
    gap: S.md,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: S.md,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  btnPrimary: { backgroundColor: C.accent, borderColor: C.accent },
  btnTxt: { color: C.text, fontSize: F.body, fontWeight: '800' },
  btnTxtPrimary: { color: '#FFFFFF' },
});
