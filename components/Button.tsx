import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { borders, colors, layout, onSurface, radii, shadowOffset, shadows, spacing, textStyles } from '@/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  /** `primary` is the screen's main action (tomato). Use it once per screen. */
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

const TONE = { primary: 'tomato', secondary: 'paper' } as const;

export function Button({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const [focused, setFocused] = useState(false);
  const tone = disabled ? 'paper2' : TONE[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors[tone] },
        // The shadow is what says "you can press this". Pressing pushes the
        // button into the spot where its shadow was.
        !disabled && !pressed && styles.raised,
        pressed && styles.pressed,
        focused && styles.focused,
      ]}>
      <Text style={[textStyles.label, styles.label, { color: onSurface[tone] }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: borders.outline,
    borderColor: colors.ink,
    borderRadius: radii.md,
  },
  raised: {
    boxShadow: shadows.pressable,
  },
  pressed: {
    transform: [{ translateX: shadowOffset.pressable }, { translateY: shadowOffset.pressable }],
  },
  focused: {
    outlineStyle: 'solid',
    outlineColor: colors.ink,
    outlineWidth: borders.focus,
    outlineOffset: borders.focus,
  },
  label: {
    textAlign: 'center',
  },
});
