import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HideTaskCard } from '@/components/home/HideTaskCard';
import { RoundProgress } from '@/components/home/RoundProgress';
import { RumourList } from '@/components/home/RumourList';
import { LoadState } from '@/components/LoadState';
import { Screen } from '@/components/Screen';
import { SAMPLE_STATES, sampleHome, type SampleState } from '@/lib/sample/home';
import { spacing, textStyles } from '@/theme';

const isSampleState = (value: unknown): value is SampleState => SAMPLE_STATES.includes(value as SampleState);

/**
 * M0 sample: the home screen as the holder sees it, fed with made-up data to
 * check the visual system. `?state=loading|error|empty` shows the other
 * states (hiddenlayer://?state=error). Real data comes in later milestones.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { state } = useLocalSearchParams<{ state?: string }>();
  // Retry stands in for a refetch that succeeds.
  const retry = () => router.setParams({ state: 'ready' });
  const { round, task, rumours } = sampleHome(isSampleState(state) ? state : 'ready', retry);
  // TODO(M4): open the hide flow (rules checklist + camera) instead.
  const [cameraNoteShown, setCameraNoteShown] = useState(false);

  return (
    <Screen>
      <View>
        <Text style={textStyles.label}>{t('brand.name')}</Text>
        <Text style={textStyles.small}>{t('brand.tagline')}</Text>
      </View>

      <RoundProgress {...round} />

      {task.status === 'ready' ? (
        <View style={styles.hero}>
          <HideTaskCard
            targetName={task.targetName}
            deskLocation={task.deskLocation}
            hoursLeft={task.hoursLeft}
            minutesLeft={task.minutesLeft}
            onTakePhoto={() => setCameraNoteShown(true)}
            footnote={cameraNoteShown ? t('sample.cameraPending') : undefined}
          />
        </View>
      ) : null}
      {task.status === 'loading' ? <LoadState status="loading" message={t('home.task.loading')} /> : null}
      {task.status === 'error' ? <LoadState status="error" message={t('home.task.error')} onRetry={retry} /> : null}
      {/* Same text for everyone with nothing to do, targets included (SPEC §6). */}
      {task.status === 'empty' ? <Text style={textStyles.body}>{t('home.task.empty')}</Text> : null}

      <RumourList status={rumours.status} rumours={rumours.items} onRetry={retry} />

      <Text style={textStyles.small}>{t('sample.note')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Room for the tilt and the hard shadow, so neither touches the screen edge.
  hero: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
});
