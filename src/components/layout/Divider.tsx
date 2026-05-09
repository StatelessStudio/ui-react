import React from 'react';
import { styles, StyleProps } from '@/style-engine';

const dividerStyles = styles({
	base: 'border-slate-200',
	variants: {
		orientation: {
			horizontal: 'w-full border-t',
			vertical: 'h-full min-h-[1em] border-l inline-block align-middle',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

type DividerVariantProps = StyleProps<typeof dividerStyles>;

export interface DividerProps
	extends
		Omit<React.HTMLAttributes<HTMLHRElement>, keyof DividerVariantProps>,
		DividerVariantProps {}

export function Divider({
	orientation = dividerStyles.defaults.orientation,
	className = '',
	...props
}: DividerProps) {
	return (
		<hr
			aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
			{...props}
			{...dividerStyles.render({ orientation, className })}
		/>
	);
}
