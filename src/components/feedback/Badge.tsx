import React from 'react';
import { styles, StyleProps } from '@/style-engine';
import { colorStyles } from '@/colors/colors';

const badgeStyles = styles({
	base: 'inline-flex items-center justify-center rounded-full font-semibold',
	variants: {
		size: {
			sm: 'px-2 py-0.5 text-xs',
			md: 'px-2.5 py-0.5 text-sm',
			lg: 'px-3 py-1 text-base',
		},
		color: colorStyles,
	},
	defaults: {
		size: 'md',
		color: 'muted',
	},
});

type BadgeVariantProps = StyleProps<typeof badgeStyles>;

export interface BadgeProps
	extends
		Omit<React.HTMLAttributes<HTMLSpanElement>, keyof BadgeVariantProps>,
		BadgeVariantProps {}

export function Badge({
	size = badgeStyles.defaults.size,
	color = badgeStyles.defaults.color,
	children,
	className = '',
	...props
}: BadgeProps) {
	return (
		<span
			{...props}
			{...badgeStyles.render({ size, color, className })}
		>
			{children}
		</span>
	);
}
