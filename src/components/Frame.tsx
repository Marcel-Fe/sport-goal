/**
 * Hält den Inhalt auf Handy-Breite (max. 480px) und zentriert ihn.
 * Auf echten Handys (< 480px) volle Breite; auf breiten Screens wie eine App.
 */
import { StyleSheet, View, type ViewStyle } from 'react-native';

export default function Frame({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.frame, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
