import type { ReactNode } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { borders, colors } from '@/theme';

export type IconProps = {
  size?: number;
  color?: string;
};

/**
 * Our own icons, drawn with the same thick stroke as the card outlines
 * (SPEC §14). They sit next to text that carries the meaning, so screen
 * readers skip them.
 */
function Icon({ size = 24, color = colors.ink, children }: IconProps & { children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={borders.outline}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
      importantForAccessibility="no">
      {children}
    </Svg>
  );
}

/** Time left on a deadline. */
export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v5l3.5 2" />
    </Icon>
  );
}

/** Where a desk is: a table with a monitor on it. */
export function DeskIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="M8 3.5h8v6H8z" />
      <Path d="M12 9.5v4" />
      <Path d="M2.5 13.5h19" />
      <Path d="M5.5 13.5v7" />
      <Path d="M18.5 13.5v7" />
    </Icon>
  );
}

/** Someone found the object. */
export function FoundIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Circle cx={10.5} cy={10.5} r={7} />
      <Path d="M16 16l5.5 5.5" />
    </Icon>
  );
}

/** A hide nobody spotted: an eye, crossed out. */
export function UndetectableIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <Path d="M2 12c2.6-4.3 6-6.5 10-6.5s7.4 2.2 10 6.5c-2.6 4.3-6 6.5-10 6.5s-7.4-2.2-10-6.5z" />
      <Path d="M4.5 3.5l15 17" />
    </Icon>
  );
}
