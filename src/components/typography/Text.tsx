import React from 'react';
import { textColors } from '@/colors';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

const textStyles = styles({
	variants: {
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			base: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
			'4xl': 'text-4xl',
		},
		weight: {
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
			extrabold: 'font-extrabold',
		},
		color: textColors,
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
			justify: 'text-justify',
		},
	},
	defaults: {
		size: 'base',
		weight: 'normal',
		color: 'default',
		align: 'left',
	},
});

type TextVariantProps = StyleProps<typeof textStyles>;

export type TextProps<E extends React.ElementType = 'p'> = PolymorphicProps<
	E,
	TextVariantProps
>;

export function Text<E extends React.ElementType = 'p'>({
	as,
	size = textStyles.defaults.size,
	weight = textStyles.defaults.weight,
	color = textStyles.defaults.color,
	align = textStyles.defaults.align,
	className = '',
	children,
	...props
}: TextProps<E>) {
	const Component = as || 'p';

	return (
		<Component
			{...props}
			{...textStyles.render({ size, weight, color, align, className })}
		>
			{children}
		</Component>
	);
}
