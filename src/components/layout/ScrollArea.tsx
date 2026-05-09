import React from 'react';
import { styles, StyleProps } from '@/style-engine';

const scrollAreaStyles = styles({
	base: '',
	variants: {
		orientation: {
			vertical: 'overflow-y-auto overflow-x-hidden',
			horizontal: 'overflow-x-auto overflow-y-hidden',
			both: 'overflow-auto',
		},
		hideScrollbar: {
			true: [
				'[&::-webkit-scrollbar]:hidden',
				'[-ms-overflow-style:none]',
				'[scrollbar-width:none]',
			].join(' '),
			false: '',
		},
	},
	defaults: {
		orientation: 'vertical',
		hideScrollbar: false,
	},
});

type ScrollAreaStyleProps = StyleProps<typeof scrollAreaStyles>;

export interface ScrollAreaProps
	extends
		Omit<
			React.HTMLAttributes<HTMLDivElement>,
			'className' | keyof ScrollAreaStyleProps
		>,
		ScrollAreaStyleProps {
	className?: string;
}

export function ScrollArea({
	orientation = scrollAreaStyles.defaults.orientation,
	hideScrollbar,
	className = '',
	children,
	...props
}: ScrollAreaProps) {
	return (
		<div
			{...props}
			{...scrollAreaStyles.render({ orientation, hideScrollbar, className })}
		>
			{children}
		</div>
	);
}
