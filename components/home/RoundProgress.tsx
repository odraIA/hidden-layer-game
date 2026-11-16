import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { borders, colors, radii, spacing, textStyles } from '@/theme';

type RoundProgressProps = {
  roundNumber: number;
  hidesDone: number;
  hidesTotal: number;
};

/**
 * Public round status (SPEC §6). One step per hide in the chain, so the bar
 * reads as layers stacking up. It says how many, never who.
 */
export function RoundProgress({ roundNumber, hidesDone, hidesTotal }: RoundProgressProps) {
  const { t } = useTranslation();
  const progress = t('home.round.progress', { done: hidesDone, total: hidesTotal });

  return (
    <View style={styles.wrapper}>
      <Text style={textStyles.title} accessibilityRole="header">
        {t('home.round.title', { number: roundNumber })}
      </Text>
      <View
        style={styles.steps}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={progress}
        accessibilityValue={{ min: 0, max: hidesTotal, now: hidesDone }}>
        {Array.from({ length: hidesTotal }, (_, index) => (
          <View key={index} style={[styles.step, index < hidesDone && styles.stepDone]} />
        ))}
      </View>
      <Text style={textStyles.body}>{progress}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  steps: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    height: spacing.lg,
    backgroundColor: colors.paper,
    borderWidth: borders.outlineSmall,
    borderColor: colors.ink,
    borderRadius: radii.sm / 2,
  },
  stepDone: {
    backgroundColor: colors.teal,
  },
});
