export const colorStyles = {
	primary: 'bg-primary text-white',
	secondary: 'bg-secondary text-white',
	accent: 'bg-accent text-white',
	muted: 'bg-muted text-foreground',
	success: 'bg-success text-white',
	warning: 'bg-warning text-white',
	danger: 'bg-danger text-white',
	info: 'bg-info text-white',
	gradient: 'bg-gradient-ui text-white',
} as const;

export type ColorVariant = keyof typeof colorStyles;

export const textColors = {
	default: 'text-foreground',
	primary: 'text-primary',
	secondary: 'text-secondary',
	accent: 'text-accent',
	muted: 'text-muted',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger',
	info: 'text-info',
	gradient: 'text-gradient-ui',
} as const satisfies Record<ColorVariant & 'default', string>;

export const focusRingColors = {
	primary: 'focus:ring-primary',
	secondary: 'focus:ring-secondary',
	accent: 'focus:ring-accent',
	muted: 'focus:ring-muted',
	success: 'focus:ring-success',
	warning: 'focus:ring-warning',
	danger: 'focus:ring-danger',
	info: 'focus:ring-info',
	gradient: 'focus:ring-primary',
} as const satisfies Record<ColorVariant, string>;
