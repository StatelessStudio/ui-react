import { LabelHTMLAttributes } from 'react';
import { StyleProps, styles } from '@/style-engine';

const labelStyles = styles({
	base: 'leading-none select-none',
	variants: {
		size: {
			sm: 'text-xs font-medium',
			md: 'text-sm font-medium',
			lg: 'text-base font-medium',
		},
		disabled: {
			true: 'opacity-50 cursor-not-allowed',
			false: 'cursor-pointer',
		},
		invalid: {
			true: 'text-danger',
			false: '',
		},
	},
	defaults: {
		size: 'md',
		disabled: 'false',
		invalid: 'false',
	},
});

type LabelVariantProps = Omit<
	StyleProps<typeof labelStyles>,
	'disabled' | 'invalid'
>;

export interface LabelProps extends Omit<
	LabelHTMLAttributes<HTMLLabelElement>,
	keyof LabelVariantProps
> {
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
}

export function Label({
	size,
	disabled = false,
	invalid = false,
	className = '',
	...props
}: LabelProps) {
	return (
		<label
			{...props}
			{...labelStyles.render({
				size,
				disabled: disabled ? 'true' : 'false',
				invalid: invalid ? 'true' : 'false',
				className,
			})}
		/>
	);
}
