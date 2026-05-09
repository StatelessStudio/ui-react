import { ButtonHTMLAttributes, ReactNode } from 'react';
import { styles } from '@/style-engine';

const toolbarButtonStyles = styles({
	base:
		'p-1.5 rounded-md ' +
		'hover:bg-slate-200 dark:hover:bg-slate-700 ' +
		'text-slate-700 dark:text-slate-300 ' +
		'transition-colors focus:outline-none focus:ring-2 focus:ring-primary ' +
		'[&>svg]:w-5 [&>svg]:h-5 flex items-center justify-center',
	variants: {},
	defaults: {},
});

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ReactNode;
	label?: string;
}

export function ToolbarButton({
	className = '',
	icon,
	label,
	children,
	...props
}: ToolbarButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			{...toolbarButtonStyles.render({ className })}
			{...props}
		>
			{icon || children}
		</button>
	);
}
