import type { TFunction } from 'i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { FoundIcon, UndetectableIcon } from '@/components/icons';
import { LoadState } from '@/components/LoadState';
import { spacing, textStyles } from '@/theme';

/** How long a hide lasted, already split into parts by the server. */
type Duration = { days: number; hours: number; minutes: number };

/**
 * One line of the anonymous feed. These two kinds are all a player may see
 * during a round (SPEC §6): no names, no desks, no photos.
 */
export type Rumour = { id: string; kind: 'found'; hiddenFor: Duration } | { id: string; kind: 'undetectable' };

type RumourListProps = {
  status: 'loading' | 'error' | 'ready';
  rumours: readonly Rumour[];
  onRetry: () => void;
};

/** Biggest unit plus the next one, dropping the next one when it is 0. */
export function formatDuration(t: TFunction, { days, hours, minutes }: Duration): string {
  if (days > 0) {
    return hours > 0 ? t('duration.daysHours', { count: days, hours }) : t('duration.days', { count: days });
  }
  if (hours > 0) return minutes > 0 ? t('duration.hoursMinutes', { hours, minutes }) : t('duration.hours', { hours });
  return t('duration.minutes', { minutes });
}

function RumourRow({ rumour }: { rumour: Rumour }) {
  const { t } = useTranslation();
  const found = rumour.kind === 'found';
  const Icon = found ? FoundIcon : UndetectableIcon;
  const text = found
    ? t('home.rumours.found', { duration: formatDuration(t, rumour.hiddenFor) })
    : t('home.rumours.undetectable');

  return (
    <Card>
      <View style={styles.row}>
        <Icon />
        <Text style={[textStyles.body, styles.rowText]}>{text}</Text>
      </View>
    </Card>
  );
}

export function RumourList({ status, rumours, onRetry }: RumourListProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text style={textStyles.title} accessibilityRole="header">
        {t('home.rumours.title')}
      </Text>

      {status === 'loading' ? <LoadState status="loading" message={t('home.rumours.loading')} /> : null}

      {status === 'error' ? <LoadState status="error" message={t('home.rumours.error')} onRetry={onRetry} /> : null}

      {status === 'ready' && rumours.length === 0 ? (
        <Text style={textStyles.body}>{t('home.rumours.empty')}</Text>
      ) : null}

      {status === 'ready' ? rumours.map((rumour) => <RumourRow key={rumour.id} rumour={rumour} />) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
});
