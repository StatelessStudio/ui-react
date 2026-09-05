import { MenuItem } from './MenuItem';
import { ObjectLabel, type ObjectLabelProps } from '../media/ObjectLabel';
import { Text, TextProps } from '../typography';

import type { MenuCategory } from './menu';
import { ColorVariant } from '@/colors';

export interface ObjectMenuItemProps {
	color?: ColorVariant;
	gap?: ObjectLabelProps['gap'];
	textSize?: TextProps['size'];
}

export function ObjectMenuItem(
	options: MenuCategory & ObjectMenuItemProps & { currentPath: string }
) {
	const isActive =
		options.currentPath === options.path ||
		options.currentPath.startsWith(options.path + '/');

	return (
		<MenuItem
			color={options.color ?? 'primary'}
			active={isActive}
		>
			<ObjectLabel
				className="w-full"
				object={options.icon}
				gap={options.gap ?? 'sm'}
				label={
					<Text
						size={options.textSize ?? 'xs'}
						color={isActive ? 'white' : undefined}
					>
						{options.name}
					</Text>
				}
			/>
		</MenuItem>
	);
}
