import React from 'react';
import { PolymorphicProps } from '@/style-engine';
import { Flex, FlexProps } from './Flex';

export type StackProps<E extends React.ElementType = 'div'> = PolymorphicProps<
	E,
	Omit<FlexProps<E>, 'direction'>
>;

export function Stack<E extends React.ElementType = 'div'>({
	as,
	...props
}: StackProps<E>) {
	return (
		<Flex<E>
			as={as}
			direction="col"
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(props as any)}
		/>
	);
}
