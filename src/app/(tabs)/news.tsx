import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NewsCompact } from '@/components/cards';
import { Card } from '@/components/primitives';
import { C, F, S } from '@/constants/tokens';
import { NEWS } from '@/data/mock';
import { useFavorites } from '@/store/favorites';

export default function NewsTab() {
  const { favorites } = useFavorites();
  // Personalisiert: News zu Favoriten zuerst, danach der Rest.
  const favSet = new Set(favorites.teamIds);
  const sorted = [...NEWS].sort(
    (a, b) => Number(favSet.has(b.teamId)) - Number(favSet.has(a.teamId)),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.h1}>Meine News</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={{ gap: S.lg }}>
            {sorted.map((n, i) => (
              <View key={n.id}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <NewsCompact item={n} />
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { color: C.text, fontSize: F.h1, fontWeight: '900', paddingHorizontal: S.lg, paddingTop: S.md },
  scroll: { padding: S.lg, paddingBottom: S.xxl },
  divider: { height: 1, backgroundColor: C.borderSoft, marginTop: S.lg },
});
