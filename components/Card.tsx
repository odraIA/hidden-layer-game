import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { borders, colors, layout, radii, shadows, spacing, type ColorToken } from '@/theme';

type CardProps = {
  /**
   * `hero` is the one sticker card a screen may have: tilted, with a hard
   * shadow. Everything else is `flat`: outline only.
   */
  variant?: 'hero' | 'flat';
  tone?: ColorToken;
  children: ReactNode;
};

export function Card({ variant = 'flat', tone = 'paper2', children }: CardProps) {
  return (
    <View style={[styles.base, variant === 'hero' ? styles.hero : styles.flat, { backgroundColor: colors[tone] }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: borders.outline,
    borderColor: colors.ink,
  },
  flat: {
    borderRadius: radii.md,
    padding: spacing.md,
  },
  hero: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    boxShadow: shadows.hero,
    transform: [{ rotate: layout.heroTilt }],
  },
});
