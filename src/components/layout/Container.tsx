import React from 'react';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

const containerStyles = styles({
	base: 'mx-auto w-full px-4 sm:px-6 lg:px-8',
	variants: {
		size: {
			sm: 'max-w-screen-sm',
			md: 'max-w-screen-md',
			lg: 'max-w-screen-lg',
			xl: 'max-w-screen-xl',
			'2xl': 'max-w-screen-2xl',
			fluid: 'max-w-full',
		},
	},
	defaults: {
		size: 'lg',
	},
});

type ContainerVariantProps = StyleProps<typeof containerStyles>;

export type ContainerProps<E extends React.ElementType = 'div'> =
	PolymorphicProps<E, ContainerVariantProps>;

export function Container<E extends React.ElementType = 'div'>({
	as,
	children,
	size = containerStyles.defaults.size,
	className = '',
	...props
}: ContainerProps<E>) {
	const Component = as || 'div';
	return (
		<Component
			{...props}
			{...containerStyles.render({ size, className })}
		>
			{children}
		</Component>
	);
}
