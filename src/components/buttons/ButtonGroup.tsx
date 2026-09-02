import React from 'react';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

const horizontalGrouped = [
	'[&>*:not(:first-child):not(:last-child)]:rounded-none',
	'[&>*:first-child]:rounded-r-none',
	'[&>*:last-child]:rounded-l-none',
	'[&>*:not(:first-child)]:-ml-px',
];

const verticalGrouped = [
	'[&>*]:rounded-xl',
	'[&>*:not(:first-child):not(:last-child)]:rounded-none',
	'[&>*:first-child]:rounded-b-none',
	'[&>*:last-child]:rounded-t-none',
	'[&>*:not(:first-child)]:-mt-px',
];

export const buttonGroupStyles = styles({
	base: [
		'inline-flex shadow-sm relative',

		'[&>*]:relative [&>*:hover]:z-10 [&>*:focus]:z-10 [&>*:active]:z-10',
	],
	variants: {
		appearance: {
			pill: 'border border-muted/20 shadow-sm p-[4px] gap-[12px]',
			grouped: '',
		},
		orientation: {
			horizontal: ['flex-row rounded-full'],
			vertical: ['flex-col rounded-xl'],
		},
	},
	defaults: {
		orientation: 'horizontal',
		appearance: 'grouped',
	},
	rules: (opts) => {
		if (opts.appearance === 'grouped') {
			if (opts.orientation === 'horizontal') {
				return horizontalGrouped;
			}
			else if (opts.orientation === 'vertical') {
				return verticalGrouped;
			}
		}
	},
});

export type ButtonGroupProps<E extends React.ElementType> = PolymorphicProps<
	E,
	StyleProps<typeof buttonGroupStyles>
>;

export function ButtonGroup<E extends React.ElementType = 'div'>({
	children,
	as,
	appearance = buttonGroupStyles.defaults.appearance,
	orientation = buttonGroupStyles.defaults.orientation,
	className = '',
	...props
}: ButtonGroupProps<E>) {
	const Component = (as ?? 'div') as React.ElementType;

	return (
		<Component
			role="group"
			{...buttonGroupStyles.render({ orientation, appearance, className })}
			{...props}
		>
			{children}
		</Component>
	);
}
