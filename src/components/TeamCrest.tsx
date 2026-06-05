/**
 * Platzhalter-Wappen statt geschützter Vereinslogos.
 * Emblem-Optik (Doppelring) in den offiziellen Vereinsfarben + Initialen.
 * Rechtlich sauber für den Prototyp; später austauschbar gegen lizenzierte Logos.
 */
import { StyleSheet, Text, View } from 'react-native';

import { getTeam } from '@/data/teams';

export default function TeamCrest({
  teamId,
  size = 40,
}: {
  teamId: string;
  size?: number;
}) {
  const team = getTeam(teamId);
  const [fill, accent] = team?.colors ?? ['#2A3346', '#FFFFFF'];
  const initials = team?.initials ?? '??';
  const showRings = size >= 30;

  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent,
          padding: showRings ? Math.max(1.5, size * 0.05) : 0,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            borderRadius: size / 2,
            backgroundColor: fill,
            borderColor: accent,
            borderWidth: showRings ? Math.max(1.5, size * 0.06) : Math.max(1.5, size * 0.05),
          },
        ]}
      >
        {/* dezenter Glanz oben */}
        <View
          style={[
            styles.shine,
            { borderTopLeftRadius: size / 2, borderTopRightRadius: size / 2, height: size * 0.4 },
          ]}
        />
        <Text
          style={{
            color: accent,
            fontWeight: '900',
            fontSize: size * 0.34,
            letterSpacing: -0.5,
          }}
        >
          {initials}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
