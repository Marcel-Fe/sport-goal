import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Crest from '@/components/Crest';
import Frame from '@/components/Frame';
import { Card } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import { SPORTS } from '@/data/teams';
import { useFavorites } from '@/store/favorites';

const APP_URL = 'https://marcel-fe.github.io/sport-goal/';

async function shareApp() {
  const msg = 'SPORT GOAL – mein persönliches Sport-Dashboard';
  try {
    if (Platform.OS === 'web') {
      const nav: any = (globalThis as any).navigator;
      if (nav?.share) await nav.share({ title: 'SPORT GOAL', text: msg, url: APP_URL });
      else if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(APP_URL);
        (globalThis as any).alert?.('Link kopiert:\n' + APP_URL);
      } else (globalThis as any).alert?.(APP_URL);
    } else {
      await Share.share({ message: `${msg}: ${APP_URL}`, url: APP_URL });
    }
  } catch {
    // Abbruch durch Nutzer – nichts tun
  }
}

export default function More() {
  const { favorites, reset } = useFavorites();

  const onReset = async () => {
    await reset();
    router.replace('/onboarding');
  };

  const sportLabels = SPORTS.filter((s) => favorites.sports.includes(s.id)).map((s) => s.label);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Frame>
      <Text style={styles.h1}>Mehr</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Teilen */}
        <Pressable style={styles.shareBtn} onPress={shareApp}>
          <Ionicons name="share-social" size={20} color={C.text} />
          <Text style={styles.shareText}>App teilen</Text>
          <Ionicons name="chevron-forward" size={18} color={C.textDim} />
        </Pressable>

        {/* Premium */}
        <LinearGradient
          colors={[C.accent, C.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premium}
        >
          <Ionicons name="star" size={22} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Upgrade auf Premium</Text>
            <Text style={styles.premiumSub}>Werbefrei · unbegrenzte KI-Abfragen · Transfer-Radar Pro</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </LinearGradient>

        {/* Favoriten */}
        <Text style={styles.sectionLabel}>MEINE FAVORITEN</Text>
        <Card>
          <Text style={styles.favLabel}>Vereine & Athleten</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crestRow}>
            {favorites.teamIds.length === 0 ? (
              <Text style={styles.empty}>Noch keine ausgewählt</Text>
            ) : (
              favorites.teamIds.map((id) => (
                <Pressable key={id} onPress={() => router.push(`/team/${id}`)} style={styles.crestItem}>
                  <Crest teamId={id} size={44} />
                </Pressable>
              ))
            )}
          </ScrollView>
          {sportLabels.length > 0 ? (
            <Text style={styles.sportsLine}>Sportarten: {sportLabels.join(' · ')}</Text>
          ) : null}
        </Card>

        {/* Einstellungen */}
        <Text style={styles.sectionLabel}>EINSTELLUNGEN</Text>
        <Card>
          <SettingRow icon="notifications-outline" label="Benachrichtigungen" />
          <Divider />
          <SettingRow icon="globe-outline" label="Sprache · Deutsch" />
          <Divider />
          <SettingRow icon="moon-outline" label="Dark Mode" value="An" />
          <Divider />
          <SettingRow icon="shield-checkmark-outline" label="Datenschutz (DSGVO)" />
          <Divider />
          <SettingRow icon="refresh-outline" label="Onboarding zurücksetzen" onPress={onReset} danger />
        </Card>

        <Text style={styles.footerNote}>SPORT GOAL · Prototyp v0.1 · Beispiel-Daten</Text>
      </ScrollView>
      </Frame>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? C.accent : C.textDim} />
      <Text style={[styles.settingLabel, danger && { color: C.accent }]}>{label}</Text>
      {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={C.textFaint} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  h1: { color: C.text, fontSize: F.h1, fontWeight: '900', paddingHorizontal: S.lg, paddingTop: S.md },
  scroll: { padding: S.lg, gap: S.lg, paddingBottom: S.xxl },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    borderRadius: R.lg,
    padding: S.lg,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: S.lg,
    paddingVertical: S.lg,
  },
  shareText: { flex: 1, color: C.text, fontSize: F.body, fontWeight: '800' },
  premiumTitle: { color: '#FFFFFF', fontSize: F.h3, fontWeight: '900' },
  premiumSub: { color: 'rgba(255,255,255,0.9)', fontSize: F.tiny, marginTop: 2 },
  sectionLabel: { color: C.textFaint, fontSize: F.tiny, fontWeight: '800', letterSpacing: 0.6, marginBottom: -S.sm },
  favLabel: { color: C.textDim, fontSize: F.small, fontWeight: '700', marginBottom: S.md },
  crestRow: { gap: S.md },
  crestItem: {},
  empty: { color: C.textFaint, fontSize: F.small },
  sportsLine: { color: C.textDim, fontSize: F.small, marginTop: S.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  settingLabel: { color: C.text, fontSize: F.body, fontWeight: '600', flex: 1 },
  settingValue: { color: C.textDim, fontSize: F.small },
  divider: { height: 1, backgroundColor: C.borderSoft },
  footerNote: { color: C.textFaint, fontSize: F.tiny, textAlign: 'center' },
});
