import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { colors, spacing, textStyles } from '@/theme';

type LoadStateProps =
  | { status: 'loading'; message: string }
  | { status: 'error'; message: string; onRetry: () => void };

/** What a data block shows before it has data: a spinner with text, or what failed plus a retry. */
export function LoadState(props: LoadStateProps) {
  const { t } = useTranslation();

  if (props.status === 'loading') {
    return (
      <View style={styles.row}>
        <ActivityIndicator color={colors.ink} />
        <Text style={[textStyles.body, styles.text]}>{props.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.error}>
      <Text style={textStyles.body} accessibilityLiveRegion="polite">
        {props.message}
      </Text>
      <Button variant="secondary" label={t('common.retry')} onPress={props.onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    flex: 1,
  },
  error: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
});
