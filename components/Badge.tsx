import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { borders, colors, onSurface, radii, spacing, textStyles, type ColorToken } from '@/theme';

import type { IconProps } from './icons';

type BadgeProps = {
  /** A real status or value. Never a decorative label. */
  label: string;
  tone?: ColorToken;
  icon?: ComponentType<IconProps>;
};

const ICON_SIZE = 18;

export function Badge({ label, tone = 'paper', icon: Icon }: BadgeProps) {
  const foreground = onSurface[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors[tone] }]}>
      {Icon ? <Icon size={ICON_SIZE} color={foreground} /> : null}
      <Text style={[textStyles.strong, styles.label, { color: foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: borders.outlineSmall,
    borderColor: colors.ink,
    borderRadius: radii.sm,
  },
  label: {
    flexShrink: 1,
  },
});
