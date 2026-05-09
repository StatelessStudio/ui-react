import React from 'react';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

export const buttonGroupStyles = styles({
	base: [
		'inline-flex shadow-sm relative',
		'[&>*]:relative [&>*:hover]:z-10 [&>*:focus]:z-10 [&>*:active]:z-10',
	],
	variants: {
		orientation: {
			horizontal: [
				'flex-row',
				'[&>*:not(:first-child):not(:last-child)]:rounded-none',
				'[&>*:first-child]:rounded-r-none',
				'[&>*:last-child]:rounded-l-none',
				'[&>*:not(:first-child)]:-ml-px',
			],
			vertical: [
				'flex-col',
				'[&>*:not(:first-child):not(:last-child)]:rounded-none',
				'[&>*:first-child]:rounded-b-none',
				'[&>*:last-child]:rounded-t-none',
				'[&>*:not(:first-child)]:-mt-px',
			],
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

export type ButtonGroupProps<E extends React.ElementType> = PolymorphicProps<
	E,
	StyleProps<typeof buttonGroupStyles>
>;

export function ButtonGroup<E extends React.ElementType = 'div'>({
	children,
	as,
	orientation = buttonGroupStyles.defaults.orientation,
	className = '',
	...props
}: ButtonGroupProps<E>) {
	const Component = (as ?? 'div') as React.ElementType;

	return (
		<Component
			role="group"
			{...buttonGroupStyles.render({ orientation, className })}
			{...props}
		>
			{children}
		</Component>
	);
}
