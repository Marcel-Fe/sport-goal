/**
 * Zeigt ein echtes Vereinslogo (Badge-URL von der Sport-API) auf hellem Kreis.
 * Ohne URL → Fallback auf das Platzhalter-Wappen (TeamCrest) bzw. neutralen Kreis.
 */
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import TeamCrest from '@/components/TeamCrest';
import { C } from '@/constants/tokens';

export default function RemoteBadge({
  uri,
  teamId,
  fallbackInitials,
  size = 40,
}: {
  uri?: string;
  teamId?: string;
  fallbackInitials?: string;
  size?: number;
}) {
  if (uri) {
    return (
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, padding: size * 0.12 },
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          transition={150}
        />
      </View>
    );
  }
  if (teamId) return <TeamCrest teamId={teamId} size={size} />;
  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={{ color: C.textDim, fontWeight: '900', fontSize: size * 0.34 }}>
        {fallbackInitials?.slice(0, 3).toUpperCase() ?? '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  fallback: {
    backgroundColor: C.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
});
