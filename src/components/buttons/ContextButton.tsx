import React from 'react';
import { PolymorphicProps, StyleProps } from '@/style-engine';
import { buttonStyles } from './Button';

export const contextButtonStyles = buttonStyles.extend({
	base: ['inline-flex items-center justify-center rounded-full p-1 ml-1'],
	variants: {
		size: {
			sm: 'w-6 h-6',
			md: 'w-7 h-7',
			lg: 'w-8 h-8',
		},
	},
	defaults: { color: 'primary', size: 'md', fill: 'ghost' },
});

export type ContextButtonProps<E extends React.ElementType = 'button'> =
	PolymorphicProps<
		E,
		StyleProps<typeof contextButtonStyles> & {
			// Optional props
		}
	>;

/**
 * ContextButton component for use at the top-right of cards.
 * Pre-configured with ghost fill and compact styling.
 * Typically used to contain a MenuDotsIcon or similar action icon.
 */
export function ContextButton<E extends React.ElementType = 'button'>({
	children,
	as,
	color = contextButtonStyles.defaults.color,
	size = contextButtonStyles.defaults.size,
	fill = contextButtonStyles.defaults.fill,
	className = '',
	...props
}: ContextButtonProps<E>) {
	const Component = (as ?? 'button') as React.ElementType;

	return (
		<Component
			{...contextButtonStyles.render({ color, size, fill, className })}
			{...props}
		>
			{children}
		</Component>
	);
}
