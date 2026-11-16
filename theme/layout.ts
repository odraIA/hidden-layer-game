import type { ViewStyle } from 'react-native';

import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Chunky, rounded shapes. Only avatars and dots are fully round. */
export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  full: 999,
} as const;

export const borders = {
  /** Cards, buttons, avatars (SPEC §14: 3 to 4 px). */
  outline: 3,
  /** Small parts where 3 px would swallow the shape: badges, progress steps. */
  outlineSmall: 2,
  /** Keyboard focus ring. */
  focus: 3,
} as const;

/** How far a hard shadow sits from its element, in px. */
export const shadowOffset = {
  hero: 6,
  pressable: 4,
} as const;

const hardShadow = (offset: number): ViewStyle['boxShadow'] => [
  { offsetX: offset, offsetY: offset, blurRadius: 0, spreadDistance: 0, color: colors.ink },
];

/**
 * Hard offset shadows, no blur. SPEC §14 allows them in two places only:
 * the one hero card of a screen and things you can press.
 */
export const shadows = {
  hero: hardShadow(shadowOffset.hero),
  pressable: hardShadow(shadowOffset.pressable),
} as const;

export const layout = {
  /** Smallest touch target (antislop R-03). */
  minTouchTarget: 48,
  /** Content column cap so wide screens do not stretch the phone layout. */
  contentMaxWidth: 520,
  /** Sticker tilt of the hero card. */
  heroTilt: '-1deg',
} as const;

export const halftone = {
  /** Size of the repeating tile. */
  tile: 14,
  dotRadius: 1.4,
} as const;
