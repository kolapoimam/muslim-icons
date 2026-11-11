import * as React from 'react';

export type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
  size?: number | string;
  absoluteStrokeWidth?: boolean;
};

export function createIcon(displayName: string, content: React.ReactNode) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(function MuslimIcon(
    { size = 24, color = 'currentColor', strokeWidth = 2, absoluteStrokeWidth = false,
      children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, role, ...props }, ref
  ) {
    const numericSize = typeof size === 'number' ? size : Number.parseFloat(size);
    const effectiveWidth = absoluteStrokeWidth && numericSize > 0
      ? Number(strokeWidth) * 24 / numericSize : strokeWidth;
    const labelled = Boolean(ariaLabel || ariaLabelledBy || props['aria-hidden'] === false);
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={effectiveWidth}
        strokeLinecap="round" strokeLinejoin="round" role={role ?? (labelled ? 'img' : undefined)}
        aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
        aria-hidden={props['aria-hidden'] ?? (!labelled ? true : undefined)} {...props}>
        {content}{children}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
