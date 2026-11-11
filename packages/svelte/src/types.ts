import type { SVGAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

export type IconProps = Omit<SVGAttributes<SVGSVGElement>, 'color' | 'children'> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  children?: Snippet;
};
