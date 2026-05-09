import React from 'react';
import { textColors } from '@/colors';
import { styles, StyleProps } from '@/style-engine';
import { SpinnerIcon } from '@/icons';

const spinnerStyles = styles({
	base: 'motion-safe:animate-spin motion-reduce:animate-none',
	variants: {
		size: {
			sm: 'h-4 w-4',
			md: 'h-6 w-6',
			lg: 'h-8 w-8',
			xl: 'h-12 w-12',
		},
		color: textColors,
	},
	defaults: {
		size: 'md',
		color: 'primary',
	},
});

type SpinnerVariantProps = StyleProps<typeof spinnerStyles>;

export interface SpinnerProps
	extends
		Omit<React.SVGAttributes<SVGSVGElement>, keyof SpinnerVariantProps>,
		SpinnerVariantProps {}

export function Spinner({
	size = spinnerStyles.defaults.size,
	color = spinnerStyles.defaults.color,
	className = '',
	role: roleProp,
	'aria-label': ariaLabelProp,
	'aria-hidden': ariaHiddenProp,
	...props
}: SpinnerProps) {
	const hasAccessibleName =
		typeof ariaLabelProp === 'string' && ariaLabelProp.trim().length > 0;
	const role = roleProp ?? (hasAccessibleName ? 'status' : undefined);
	const ariaHidden = ariaHiddenProp ?? !hasAccessibleName;

	return (
		<SpinnerIcon
			role={role}
			aria-label={ariaLabelProp}
			aria-hidden={ariaHidden}
			focusable="false"
			{...props}
			{...spinnerStyles.render({ size, color, className })}
		/>
	);
}
