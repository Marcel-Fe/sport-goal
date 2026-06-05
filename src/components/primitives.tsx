/**
 * Kleine, wiederverwendbare UI-Bausteine im SPORT GOAL Look.
 */
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { C, F, R, S, SHADOW } from '@/constants/tokens';
import { STATUS_LABEL, type TransferStatus } from '@/data/mock';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  actionLabel = 'Alle anzeigen',
  onPress,
}: {
  title: string;
  actionLabel?: string | null;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LiveDot({ label = 'LIVE' }: { label?: string }) {
  return (
    <View style={styles.liveWrap}>
      <View style={styles.liveDot} />
      <Text style={styles.liveLabel}>{label}</Text>
    </View>
  );
}

const STATUS_COLOR: Record<TransferStatus, string> = {
  confirmed: C.green,
  negotiation: C.yellow,
  rumour: C.orange,
};

export function StatusBadge({ status }: { status: TransferStatus }) {
  return (
    <Text style={[styles.statusBadge, { color: STATUS_COLOR[status] }]}>
      {STATUS_LABEL[status]}
    </Text>
  );
}

export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function statusColor(status: TransferStatus) {
  return STATUS_COLOR[status];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    padding: S.lg,
    ...SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: S.md,
  },
  sectionTitle: {
    color: C.text,
    fontSize: F.h3,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionAction: {
    color: C.accent,
    fontSize: F.small,
    fontWeight: '700',
  },
  liveWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.live },
  liveLabel: { color: C.live, fontSize: F.tiny, fontWeight: '900', letterSpacing: 0.5 },
  statusBadge: { fontSize: F.small, fontWeight: '800' },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: C.surfaceElevated,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  chip: {
    paddingHorizontal: S.lg,
    paddingVertical: S.sm + 2,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceAlt,
  },
  chipSelected: { backgroundColor: C.accent, borderColor: C.accent },
  chipText: { color: C.textDim, fontSize: F.body, fontWeight: '700' },
  chipTextSelected: { color: C.text },
});
