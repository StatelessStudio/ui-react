import React from 'react';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

const flexStyles = styles({
	base: 'flex',
	variants: {
		direction: {
			row: 'flex-row',
			col: 'flex-col',
			'row-reverse': 'flex-row-reverse',
			'col-reverse': 'flex-col-reverse',
		},
		justify: {
			start: 'justify-start',
			end: 'justify-end',
			center: 'justify-center',
			between: 'justify-between',
			around: 'justify-around',
			evenly: 'justify-evenly',
		},
		align: {
			start: 'items-start',
			end: 'items-end',
			center: 'items-center',
			baseline: 'items-baseline',
			stretch: 'items-stretch',
		},
		wrap: {
			nowrap: 'flex-nowrap',
			wrap: 'flex-wrap',
			'wrap-reverse': 'flex-wrap-reverse',
		},
		gap: {
			none: '',
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-4',
			lg: 'gap-6',
			xl: 'gap-8',
		},
	},
	defaults: {
		direction: 'row',
		justify: 'start',
		align: 'stretch',
		wrap: 'nowrap',
		gap: 'none',
	},
});

type FlexVariantProps = StyleProps<typeof flexStyles>;

export type FlexProps<E extends React.ElementType = 'div'> = PolymorphicProps<
	E,
	Partial<FlexVariantProps>
>;

export function Flex<E extends React.ElementType = 'div'>({
	as,
	children,
	direction = flexStyles.defaults.direction,
	justify = flexStyles.defaults.justify,
	align = flexStyles.defaults.align,
	wrap = flexStyles.defaults.wrap,
	gap = flexStyles.defaults.gap,
	className = '',
	...props
}: FlexProps<E>) {
	const Component = as || 'div';
	return (
		<Component
			{...props}
			{...flexStyles.render({
				direction,
				justify,
				align,
				wrap,
				gap,
				className,
			})}
		>
			{children}
		</Component>
	);
}
