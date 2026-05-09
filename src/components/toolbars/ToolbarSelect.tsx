import { SelectHTMLAttributes } from 'react';
import { styles } from '@/style-engine';
import { ChevronDownIcon } from '@/icons';

const toolbarSelectWrapperStyles = styles({
	base: 'relative shrink-0 flex items-center',
	variants: {},
	defaults: {},
});

const toolbarSelectStyles = styles({
	base:
		'h-8 py-1 pl-3 pr-8 text-sm rounded-md appearance-none ' +
		'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
		'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 ' +
		'text-slate-700 dark:text-slate-300 ' +
		'border border-transparent cursor-pointer [&>option]:bg-background',
	variants: {},
	defaults: {},
});

const toolbarSelectIconStyles = styles({
	base:
		'absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ' +
		'pointer-events-none text-slate-500',
	variants: {},
	defaults: {},
});

export interface ToolbarSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	containerClassName?: string;
}

export function ToolbarSelect({
	className = '',
	containerClassName,
	...props
}: ToolbarSelectProps) {
	return (
		<div
			{...toolbarSelectWrapperStyles.render({ className: containerClassName })}
		>
			<select
				{...toolbarSelectStyles.render({ className })}
				{...props}
			/>
			<ChevronDownIcon {...toolbarSelectIconStyles.render({})} />
		</div>
	);
}
