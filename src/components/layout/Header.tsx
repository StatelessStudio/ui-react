import React from 'react';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

const headerStyles = styles({
	base: [
		'flex items-center h-14 md:h-16 px-4 md:px-6 w-full',
		'bg-background border-b border-muted z-10 shrink-0',
	],
	variants: {
		sticky: {
			true: 'sticky top-0',
			false: '',
		},
	},
	defaults: {
		sticky: false,
	},
});

export type HeaderProps<E extends React.ElementType = 'header'> =
	PolymorphicProps<E, StyleProps<typeof headerStyles> & { sticky?: boolean }>;

export function Header<E extends React.ElementType = 'header'>({
	as,
	sticky = false,
	className = '',
	...props
}: HeaderProps<E>) {
	const Component = as ?? 'header';

	return (
		<Component
			{...headerStyles.render({
				sticky,
				className,
			})}
			{...props}
		/>
	);
}
