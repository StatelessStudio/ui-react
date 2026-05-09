import React from 'react';
import { PolymorphicProps } from '@/style-engine';
import { Flex, FlexProps } from './Flex';

export type CenterProps<E extends React.ElementType = 'div'> = PolymorphicProps<
	E,
	Omit<FlexProps<E>, 'justify' | 'align'>
>;

export function Center<E extends React.ElementType = 'div'>({
	as,
	...props
}: CenterProps<E>) {
	return (
		<Flex<E>
			as={as}
			justify="center"
			align="center"
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(props as any)}
		/>
	);
}
