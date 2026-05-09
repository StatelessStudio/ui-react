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
	primary: 'focus:ring-primary/70',
	secondary: 'focus:ring-secondary/70',
	accent: 'focus:ring-accent/70',
	muted: 'focus:ring-muted/70',
	success: 'focus:ring-success/70',
	warning: 'focus:ring-warning/70',
	danger: 'focus:ring-danger/70',
	info: 'focus:ring-info/70',
	gradient: 'focus:ring-primary/70',
} as const satisfies Record<ColorVariant, string>;

export const hasFocusVisibleColors = {
	primary: 'has-[:focus-visible]:ring-primary/70',
	secondary: 'has-[:focus-visible]:ring-secondary/70',
	accent: 'has-[:focus-visible]:ring-accent/70',
	muted: 'has-[:focus-visible]:ring-muted-foreground/70',
	success: 'has-[:focus-visible]:ring-success/70',
	warning: 'has-[:focus-visible]:ring-warning/70',
	danger: 'has-[:focus-visible]:ring-danger/70',
	info: 'has-[:focus-visible]:ring-info/70',
	gradient: 'has-[:focus-visible]:ring-primary/70',
} as const satisfies Record<ColorVariant, string>;
