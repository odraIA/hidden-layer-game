import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { colors, halftone, layout, spacing } from '@/theme';

/** Comic-print dot screen behind every page: the app's identity motif (SPEC §14). */
function Halftone() {
  const { tile, dotRadius } = halftone;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="halftone" width={tile} height={tile} patternUnits="userSpaceOnUse">
            <Circle cx={tile / 4} cy={tile / 4} r={dotRadius} fill={colors.paper2} />
            <Circle cx={(tile * 3) / 4} cy={(tile * 3) / 4} r={dotRadius} fill={colors.paper2} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#halftone)" />
      </Svg>
    </View>
  );
}

type ScreenProps = {
  children: ReactNode;
};

/** Page shell: paper background, dot texture, safe areas and a scrolling column. */
export function Screen({ children }: ScreenProps) {
  return (
    <View style={styles.root}>
      <Halftone />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.column}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  column: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    gap: spacing.xl,
  },
});
