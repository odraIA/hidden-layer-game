import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HideTaskCard } from '@/components/home/HideTaskCard';
import { RoundProgress } from '@/components/home/RoundProgress';
import { RumourList } from '@/components/home/RumourList';
import { Screen } from '@/components/Screen';
import { sampleHome } from '@/lib/sample/home';
import { spacing, textStyles } from '@/theme';

/**
 * M0 sample: the home screen as the holder sees it, fed with made-up data to
 * check the visual system. Real state and navigation come in later milestones.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { round, task, rumours } = sampleHome;
  // TODO(M4): open the hide flow (rules checklist + camera) instead.
  const [cameraNoteShown, setCameraNoteShown] = useState(false);

  return (
    <Screen>
      <View>
        <Text style={textStyles.label}>{t('brand.name')}</Text>
        <Text style={textStyles.small}>{t('brand.tagline')}</Text>
      </View>

      <RoundProgress roundNumber={round.number} hidesDone={round.hidesDone} hidesTotal={round.hidesTotal} />

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

      <RumourList status="ready" rumours={rumours} onRetry={() => {}} />

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
