import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NewsCompact } from '@/components/cards';
import Frame from '@/components/Frame';
import { LiveNewsFeatured, LiveNewsRow } from '@/components/live-cards';
import { Card } from '@/components/primitives';
import { C, F, S } from '@/constants/tokens';
import { NEWS } from '@/data/mock';
import { useFavoritesNews } from '@/hooks/use-live';
import { useFavorites } from '@/store/favorites';

export default function NewsTab() {
  const { favorites } = useFavorites();
  const news = useFavoritesNews(favorites.teamIds);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Frame>
        <Text style={styles.h1}>Meine News</Text>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {news.loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={C.accent} />
            </View>
          ) : news.items && news.items.length > 0 ? (
            <Card>
              <LiveNewsFeatured item={news.items[0]} teamId={news.items[0].teamId} />
              {news.items.length > 1 ? <View style={styles.divider} /> : null}
              <View style={{ gap: S.lg }}>
                {news.items.slice(1, 20).map((n, i) => (
                  <View key={`${n.teamId}-${i}`}>
                    {i > 0 ? <View style={styles.rowDivider} /> : null}
                    <View style={{ paddingTop: i > 0 ? S.md : 0 }}>
                      <LiveNewsRow item={n} teamId={n.teamId} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : (
            // Fallback: keine echten News erreichbar → Demo-Schlagzeilen
            <Card>
              <View style={{ gap: S.lg }}>
                {NEWS.map((n, i) => (
                  <View key={n.id}>
                    {i > 0 ? <View style={styles.divider} /> : null}
                    <NewsCompact item={n} />
                  </View>
                ))}
              </View>
            </Card>
          )}
        </ScrollView>
      </Frame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { color: C.text, fontSize: F.h1, fontWeight: '900', paddingHorizontal: S.lg, paddingTop: S.md },
  scroll: { padding: S.lg, paddingBottom: S.xxl },
  loading: { paddingVertical: S.xxl, alignItems: 'center' },
  divider: { height: 1, backgroundColor: C.borderSoft, marginTop: S.lg },
  rowDivider: { height: 1, backgroundColor: C.borderSoft },
});
