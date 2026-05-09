import React from 'react';
import { transitionAnimations } from '@/animations';
import { focusRingColors, textColors } from '@/colors';
import { PolymorphicProps, StyleProps } from '@/style-engine';
import { baseStyles } from '@/styles';

export const buttonStyles = baseStyles.extend({
	base: [
		'inline-flex rounded-md px-5 py-2',
		'focus:outline-none focus:ring-2',
		transitionAnimations.transform,
		'hover:opacity-90',
		'active:translate-y-px',
		'cursor-pointer select-none',
		'disabled:opacity-50 disabled:pointer-events-none',
	],
	variants: {
		fill: {
			solid: '',
			outline: 'bg-transparent border',
			ghost: 'bg-transparent',
		},
	},
	defaults: { color: 'primary', fill: 'solid' },
	rules: (options) => {
		const classes = [];
		const color = options.color ?? 'primary';

		if (options.fill === 'outline' || options.fill === 'ghost') {
			classes.push(textColors[color]);
		}

		classes.push(focusRingColors[color]);

		return classes;
	},
});

export type ButtonProps<E extends React.ElementType> = PolymorphicProps<
	E,
	StyleProps<typeof buttonStyles> & {
		// Optional props
	}
>;

export function Button<E extends React.ElementType = 'button'>({
	children,
	as,
	color = buttonStyles.defaults.color,
	fill = buttonStyles.defaults.fill,
	size = buttonStyles.defaults.size,
	className = '',
	...props
}: ButtonProps<E>) {
	const Component = (as ?? 'button') as React.ElementType;

	return (
		<Component
			{...buttonStyles.render({ color, fill, size, className })}
			{...props}
		>
			{children}
		</Component>
	);
}
