import React from 'react';
import { Flex, FlexProps } from './Flex';
import { PolymorphicProps } from '@/style-engine';

export type GroupProps<E extends React.ElementType = 'div'> = PolymorphicProps<
	E,
	Omit<FlexProps<E>, 'direction' | 'wrap'>
>;

export function Group<E extends React.ElementType = 'div'>({
	as,
	...props
}: GroupProps<E>) {
	return (
		<Flex<E>
			as={as}
			direction="row"
			wrap="wrap"
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(props as any)}
		/>
	);
}
