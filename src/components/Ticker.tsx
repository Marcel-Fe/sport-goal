/**
 * Durchlaufendes News-Band (Marquee). Zeigt Schlagzeile + Quelle, endlos von
 * rechts nach links. Rein informativ (legal: nur Headline + Quelle, kein Link).
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { C, F } from '@/constants/tokens';
import type { NewsHeadline } from '@/data/news';

export default function Ticker({
  items,
  label,
  speed = 55,
}: {
  items: NewsHeadline[];
  label?: string;
  speed?: number; // Pixel pro Sekunde
}) {
  const tx = useRef(new Animated.Value(0)).current;
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!w) return;
    tx.setValue(0);
    const anim = Animated.loop(
      Animated.timing(tx, {
        toValue: -w,
        duration: (w / speed) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [w, speed, tx]);

  if (!items?.length) return null;

  const copy = (key: string) => (
    <View
      key={key}
      style={styles.copy}
      onLayout={key === 'a' ? (e) => setW(e.nativeEvent.layout.width) : undefined}
    >
      {items.map((it, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.dot} />
          <Text style={styles.src}>{it.source}</Text>
          <Text style={styles.txt}>{it.title}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.wrap}>
      {label ? (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{label}</Text>
        </View>
      ) : null}
      <View style={styles.viewport}>
        <Animated.View style={[styles.track, { transform: [{ translateX: tx }] }]}>
          {copy('a')}
          {copy('b')}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    height: 34,
  },
  badge: {
    backgroundColor: C.accent,
    height: 34,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  badgeTxt: { color: '#FFFFFF', fontSize: F.tiny, fontWeight: '900', letterSpacing: 0.5 },
  viewport: { flex: 1, overflow: 'hidden' },
  track: { flexDirection: 'row', alignItems: 'center' },
  copy: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent, marginHorizontal: 8 },
  src: { color: C.accent, fontSize: F.tiny, fontWeight: '800', marginRight: 6 },
  txt: { color: C.text, fontSize: F.small, fontWeight: '600' },
});
