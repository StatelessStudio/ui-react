/**
 * Navigation component shared styles.
 *
 * These variants are composed into navigation controls:
 * Breadcrumb, Menu, Toolbar, Tree, Pagination, Tabs
 */

import { colorStyles, ColorVariant } from '@/colors';
import { styles } from '@/style-engine';

const navHoverStyles: Record<ColorVariant, string> = {
	primary: 'hover:bg-primary/10',
	secondary: 'hover:bg-secondary/10',
	accent: 'hover:bg-accent/10',
	muted: 'hover:bg-muted/10',
	success: 'hover:bg-success/10',
	warning: 'hover:bg-warning/10',
	danger: 'hover:bg-danger/10',
	info: 'hover:bg-info/10',
	gradient: 'hover:bg-secondary/10',
};

export const navItemStyles = styles({
	base:
		'inline-flex items-center justify-start rounded-md p-2 gap-2 ' +
		'w-full border-none select-none transition-colors ' +
		'disabled:opacity-50 disabled:pointer-events-none',
	variants: {
		color: colorStyles,
		state: {
			active: 'font-semibold border-b-2 border-primary',
			inactive:
				'border-transparent bg-transparent text-foreground cursor-pointer',
		},
		size: {
			sm: 'px-2 py-1 text-sm',
			md: 'px-3 py-2 text-base',
			lg: 'px-4 py-3 text-lg',
		},
	},
	defaults: {
		state: 'inactive',
	},
	rules: ({ state, color }) => {
		color = color ?? 'primary';

		if (state === 'active') {
			return [colorStyles[color]];
		}
		else {
			return [navHoverStyles[color]];
		}
	},
});
