import { HTMLAttributes } from 'react';
import { styles } from '@/style-engine';

const toolbarSeparatorStyles = styles({
	base: 'bg-slate-300 dark:bg-slate-600',
	variants: {
		orientation: {
			horizontal: 'h-px w-full my-1',
			vertical: 'w-px self-stretch mx-1',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
}

export function ToolbarSeparator({
	orientation = 'vertical',
	className = '',
	...props
}: ToolbarSeparatorProps) {
	return (
		<div
			role="separator"
			aria-orientation={orientation}
			{...toolbarSeparatorStyles.render({
				orientation: orientation as 'horizontal' | 'vertical',
				className,
			})}
			{...props}
		/>
	);
}
