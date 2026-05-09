import { HTMLAttributes } from 'react';
import { styles } from '@/style-engine';

const toolbarGroupStyles = styles({
	base: 'flex gap-1',
	variants: {
		orientation: {
			horizontal: 'flex-row items-center',
			vertical: 'flex-col items-center',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
}

export function ToolbarGroup({
	orientation = 'horizontal',
	className = '',
	...props
}: ToolbarGroupProps) {
	return (
		<div
			role="group"
			{...toolbarGroupStyles.render({
				orientation: orientation as 'horizontal' | 'vertical',
				className,
			})}
			{...props}
		/>
	);
}
