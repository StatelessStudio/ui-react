import React, { ReactNode } from 'react';
import { PolymorphicProps } from '@/style-engine';
import { ColorVariant } from '@/colors';
import { MenuItem, MenuItemProps } from './MenuItem';
import { ObjectLabel, ObjectLabelProps } from '../media/ObjectLabel';
import { Text, TextProps } from '../typography/Text';

type ObjectMenuItemOwnProps = {
	name?: ReactNode;
	icon?: ReactNode;
	color?: ColorVariant;
	gap?: ObjectLabelProps['gap'];
	textSize?: TextProps['size'];
	active?: boolean;
	className?: string;
};

export type ObjectMenuItemProps<E extends React.ElementType> = PolymorphicProps<
	E,
	ObjectMenuItemOwnProps
>;

export function ObjectMenuItem<E extends React.ElementType = 'button'>({
	active = false,
	color = 'primary',
	icon,
	gap,
	textSize,
	name,
	className = '',
	...props
}: ObjectMenuItemProps<E>) {
	return (
		<MenuItem<E>
			{...(props as MenuItemProps<E>)}
			color={color}
			active={active}
			className={className}
		>
			<ObjectLabel
				className="w-full"
				object={icon}
				gap={gap ?? 'sm'}
				color={color}
				label={
					<Text
						size={textSize ?? 'xs'}
						color={active ? 'white' : undefined}
					>
						{name}
					</Text>
				}
			/>
		</MenuItem>
	);
}
