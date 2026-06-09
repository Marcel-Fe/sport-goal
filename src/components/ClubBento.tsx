/**
 * Bento-Grid mit den Schlüsselzahlen des Lieblingsvereins. Jede Kachel färbt sich
 * über die Vereinsfarbe ein (dezenter Verlauf + farbige Labels), damit das
 * Dashboard sich sichtbar an den gewählten Verein anpasst.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { alpha, shade } from '@/constants/color';
import { C, F, R, S } from '@/constants/tokens';

interface Props {
  primary: string;
  rank?: number;
  points?: number;
  played?: number;
  form?: string;
  nextValue: string;
  nextSub: string;
  league?: string;
}

function Tile({
  primary,
  label,
  children,
  flex = 1,
}: {
  primary: string;
  label: string;
  children: React.ReactNode;
  flex?: number;
}) {
  return (
    <View style={[styles.tile, { flex, borderColor: alpha(primary, 0.4) }]}>
      <LinearGradient
        colors={[alpha(primary, 0.28), alpha(primary, 0.04)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={[styles.label, { color: shade(primary, 0.45) }]}>{label}</Text>
      <View style={styles.tileBody}>{children}</View>
    </View>
  );
}

function FormDots({ form }: { form?: string }) {
  const last = (form ?? '').replace(/[^WDL]/gi, '').slice(-5).toUpperCase();
  if (!last) return <Text style={styles.big}>—</Text>;
  const color = (c: string) => (c === 'W' ? C.green : c === 'D' ? C.yellow : C.red);
  const letter = (c: string) => (c === 'W' ? 'S' : c === 'D' ? 'U' : 'N');
  return (
    <View style={styles.formRow}>
      {last.split('').map((c, i) => (
        <View key={i} style={[styles.formDot, { backgroundColor: color(c) }]}>
          <Text style={styles.formTxt}>{letter(c)}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ClubBento({
  primary,
  rank,
  points,
  played,
  form,
  nextValue,
  nextSub,
  league,
}: Props) {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <Tile primary={primary} label="TABELLENPLATZ" flex={1.25}>
          <View style={styles.rankRow}>
            <Text style={styles.rankNum}>{rank != null ? rank : '—'}</Text>
            <Text style={styles.rankUnit}>{rank != null ? '.' : ''}</Text>
          </View>
          <Text style={styles.tileSub} numberOfLines={1}>
            {league ?? 'Liga'}
          </Text>
        </Tile>
        <Tile primary={primary} label="PUNKTE">
          <Text style={styles.big}>{points != null ? points : '—'}</Text>
          <Text style={styles.tileSub}>{played != null ? `${played} Spiele` : 'Saison'}</Text>
        </Tile>
      </View>
      <View style={styles.row}>
        <Tile primary={primary} label="NÄCHSTES">
          <Text style={styles.med} numberOfLines={1}>
            {nextValue}
          </Text>
          <Text style={styles.tileSub} numberOfLines={1}>
            {nextSub}
          </Text>
        </Tile>
        <Tile primary={primary} label="FORM" flex={1.25}>
          <FormDots form={form} />
          <Text style={styles.tileSub}>letzte Spiele</Text>
        </Tile>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: S.sm },
  row: { flexDirection: 'row', gap: S.sm },
  tile: {
    minHeight: 84,
    borderRadius: R.lg,
    borderWidth: 1,
    backgroundColor: C.surface,
    overflow: 'hidden',
    padding: S.md,
    justifyContent: 'space-between',
  },
  label: { fontSize: F.tiny, fontWeight: '900', letterSpacing: 0.5 },
  tileBody: { gap: 2 },
  rankRow: { flexDirection: 'row', alignItems: 'flex-end' },
  rankNum: { color: C.text, fontSize: 32, fontWeight: '900', lineHeight: 34 },
  rankUnit: { color: C.text, fontSize: 20, fontWeight: '900', marginBottom: 3 },
  big: { color: C.text, fontSize: 28, fontWeight: '900', lineHeight: 30 },
  med: { color: C.text, fontSize: F.h3, fontWeight: '900' },
  tileSub: { color: C.textDim, fontSize: F.tiny, fontWeight: '700' },
  formRow: { flexDirection: 'row', gap: 4 },
  formDot: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  formTxt: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
});
