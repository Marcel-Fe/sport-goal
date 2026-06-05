import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TeamCrest from '@/components/TeamCrest';
import { Chip } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import { ATHLETES, SPORTS, TEAMS, type Sport } from '@/data/teams';
import { useFavorites } from '@/store/favorites';

export default function Onboarding() {
  const { save } = useFavorites();
  const [step, setStep] = useState(0);
  const [sports, setSports] = useState<Sport[]>([]);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [playerIds, setPlayerIds] = useState<string[]>([]);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // Auch Athleten zählen als Favorit (wichtig für F1/Tennis, die keine "Vereine" haben).
  const teamChoices = Object.values(TEAMS).filter(
    (t) => sports.length === 0 || sports.includes(t.sport),
  );
  const playerChoices = Object.values(ATHLETES).filter(
    (a) => sports.length === 0 || sports.includes(a.sport),
  );

  const steps = [
    { title: 'Welche Sportarten?', subtitle: 'Wähle, was dich interessiert.' },
    { title: 'Deine Favoriten', subtitle: 'Vereine & Stars – der erste wird dein Haupt-Favorit.' },
    { title: 'Lieblings-Athleten', subtitle: 'Optional – für persönliche News.' },
  ];

  const canNext = step === 0 ? sports.length > 0 : step === 1 ? teamIds.length > 0 : true;

  const finish = async () => {
    await save({ sports, teamIds, playerIds, onboarded: true });
    router.replace('/');
  };

  const next = () => {
    if (step < 2) setStep(step + 1);
    else finish();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          SPORT <Text style={{ color: C.accent }}>GOAL</Text>
        </Text>
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].subtitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View style={styles.chipWrap}>
            {SPORTS.map((s) => (
              <Chip
                key={s.id}
                label={`${s.icon}  ${s.label}`}
                selected={sports.includes(s.id)}
                onPress={() => toggle(sports, s.id, setSports)}
              />
            ))}
          </View>
        )}

        {step === 1 && (
          <View style={styles.grid}>
            {teamChoices.map((t) => {
              const sel = teamIds.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  style={[styles.tile, sel && styles.tileSelected]}
                  onPress={() => toggle(teamIds, t.id, setTeamIds)}
                >
                  <TeamCrest teamId={t.id} size={44} />
                  <Text style={styles.tileName} numberOfLines={2}>
                    {t.name}
                  </Text>
                  {sel ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>
        )}

        {step === 2 && (
          <View style={styles.grid}>
            {playerChoices.map((a) => {
              const sel = playerIds.includes(a.id);
              return (
                <Pressable
                  key={a.id}
                  style={[styles.tile, sel && styles.tileSelected]}
                  onPress={() => toggle(playerIds, a.id, setPlayerIds)}
                >
                  <TeamCrest teamId={a.teamId} size={44} />
                  <Text style={styles.tileName} numberOfLines={2}>
                    {a.name}
                  </Text>
                  <Text style={styles.tileRole}>{a.role}</Text>
                  {sel ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 2 ? (
          <Pressable onPress={finish} hitSlop={8}>
            <Text style={styles.skip}>Überspringen</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <Pressable
          style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
          disabled={!canNext}
          onPress={next}
        >
          <Text style={styles.nextText}>{step < 2 ? 'Weiter' : 'Fertig'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingTop: S.md,
  },
  logo: { color: C.text, fontSize: F.h3, fontWeight: '900', letterSpacing: 0.5, fontStyle: 'italic' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { backgroundColor: C.accent, width: 20 },
  titleBlock: { paddingHorizontal: S.lg, paddingTop: S.xl, paddingBottom: S.md },
  title: { color: C.text, fontSize: F.h1, fontWeight: '900' },
  subtitle: { color: C.textDim, fontSize: F.body, marginTop: 6 },
  scroll: { paddingHorizontal: S.lg, paddingBottom: S.xxl },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: S.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.md },
  tile: {
    width: '47.5%',
    backgroundColor: C.surface,
    borderRadius: R.lg,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: S.lg,
    alignItems: 'center',
    gap: S.sm,
  },
  tileSelected: { borderColor: C.accent, backgroundColor: C.surfaceElevated },
  tileName: { color: C.text, fontSize: F.small, fontWeight: '800', textAlign: 'center' },
  tileRole: { color: C.textFaint, fontSize: F.tiny },
  check: {
    position: 'absolute',
    top: 8,
    right: 10,
    color: C.accent,
    fontWeight: '900',
    fontSize: F.h3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  skip: { color: C.textDim, fontSize: F.body, fontWeight: '600' },
  nextBtn: {
    marginLeft: 'auto',
    backgroundColor: C.accent,
    paddingHorizontal: S.xxl,
    paddingVertical: S.md,
    borderRadius: R.pill,
  },
  nextBtnDisabled: { backgroundColor: C.surfaceElevated },
  nextText: { color: C.text, fontWeight: '800', fontSize: F.body },
});
