// ---------------------------------------------------------------------------
// Base style definitions — shared defaults for all components
// ---------------------------------------------------------------------------

import { colorStyles } from '../colors/colors';
import { styles } from '../style-engine';

const shadowStyles = {
	sm: 'shadow-sm',
	md: 'shadow',
	lg: 'shadow-lg',
	xl: 'shadow-xl',
	'2xl': 'shadow-2xl',
} as const;

export const sizeStyles = {
	sm: 'px-3 py-1 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-8 py-3 text-lg',
} as const;

export const baseStyleVariants = {
	color: colorStyles,
	shadow: shadowStyles,
	size: sizeStyles,
} as const;

/**
 * App-wide base StylesDef. Provides `shadow`, `color`, and `size` variants
 *
 * Extend this to inherit the full base variant contract:
 * @example
 * const buttonStyles = baseStyles.extend({ variants: { fill: {...} } });
 */
export const baseStyles = styles({
	variants: baseStyleVariants,
	defaults: {},
});
