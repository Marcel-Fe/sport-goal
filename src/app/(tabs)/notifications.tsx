import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Frame from '@/components/Frame';
import { Card } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';

interface Notif {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  body: string;
  time: string;
}

const NOTIFS: Notif[] = [
  { id: '1', icon: 'football', color: C.green, title: 'TOR! Bayern 1:0', body: 'Harry Kane trifft in der 23. Minute.', time: 'jetzt' },
  { id: '2', icon: 'swap-horizontal', color: C.yellow, title: 'Transfer-Update', body: 'Jonathan Tah: Verhandlungen weit fortgeschritten.', time: 'vor 1 Std.' },
  { id: '3', icon: 'mic', color: C.accent, title: 'Pressekonferenz live', body: 'Tuchel spricht vor dem Frankfurt-Spiel.', time: 'vor 2 Std.' },
  { id: '4', icon: 'medkit', color: C.red, title: 'Verletzungs-Update', body: 'Musiala zurück im Mannschaftstraining.', time: 'vor 3 Std.' },
  { id: '5', icon: 'flag', color: C.blue, title: 'Formel 1', body: 'Verstappen sichert sich die Pole in Monaco.', time: 'vor 5 Std.' },
];

export default function Notifications() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Frame>
      <Text style={styles.h1}>Mitteilungen</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={{ gap: 0 }}>
            {NOTIFS.map((n, i) => (
              <View key={n.id}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.row}>
                  <View style={[styles.iconWrap, { backgroundColor: n.color + '22' }]}>
                    <Ionicons name={n.icon} size={18} color={n.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.body}>{n.body}</Text>
                  </View>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
      </Frame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { color: C.text, fontSize: F.h1, fontWeight: '900', paddingHorizontal: S.lg, paddingTop: S.md },
  scroll: { padding: S.lg, paddingBottom: S.xxl },
  divider: { height: 1, backgroundColor: C.borderSoft, marginVertical: S.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  iconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { color: C.text, fontSize: F.body, fontWeight: '800' },
  body: { color: C.textDim, fontSize: F.small, marginTop: 2 },
  time: { color: C.textFaint, fontSize: F.tiny },
});
