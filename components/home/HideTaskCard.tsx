import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ClockIcon, DeskIcon } from '@/components/icons';
import { spacing, textStyles } from '@/theme';

type HideTaskCardProps = {
  targetName: string;
  /** Free text written by the target. Never translated (SPEC §13). */
  deskLocation: string;
  /** Working time left before the hold deadline, computed by the server. */
  hoursLeft: number;
  minutesLeft: number;
  onTakePhoto: () => void;
  /** Extra line under the button. */
  footnote?: string;
};

/** The holder's current task: who to hide it for, where, and how long is left. */
export function HideTaskCard({
  targetName,
  deskLocation,
  hoursLeft,
  minutesLeft,
  onTakePhoto,
  footnote,
}: HideTaskCardProps) {
  const { t } = useTranslation();

  return (
    <Card variant="hero" tone="mustard">
      <View style={styles.content}>
        <Text style={textStyles.display} accessibilityRole="header">
          {t('home.hide.title')}
        </Text>

        <View style={styles.target}>
          <Avatar name={targetName} />
          <View style={styles.targetText}>
            <Text style={textStyles.small}>{t('home.hide.targetLabel')}</Text>
            <Text style={textStyles.title}>{targetName}</Text>
          </View>
        </View>

        <View style={styles.desk}>
          <DeskIcon />
          <Text style={[textStyles.body, styles.deskText]}>{deskLocation}</Text>
        </View>

        <View style={styles.deadline}>
          <Badge icon={ClockIcon} label={t('home.hide.timeLeft', { hours: hoursLeft, minutes: minutesLeft })} />
          <Text style={textStyles.small}>{t('home.hide.clockNote')}</Text>
        </View>

        <Button label={t('home.hide.cta')} onPress={onTakePhoto} />
        {footnote ? (
          <Text style={textStyles.small} accessibilityLiveRegion="polite">
            {footnote}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  targetText: {
    flex: 1,
  },
  desk: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  deskText: {
    flex: 1,
  },
  deadline: {
    gap: spacing.xs,
  },
});
