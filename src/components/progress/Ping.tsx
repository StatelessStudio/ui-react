import { HTMLAttributes } from 'react';
import { styles, StyleProps } from '@/style-engine';
import { colorStyles } from '@/colors';

const sizeVariants = {
	sm: 'h-2 w-2',
	md: 'h-3 w-3',
	lg: 'h-4 w-4',
};

const pingStyles = styles({
	base: 'relative flex rounded-full',
	variants: {
		size: sizeVariants,
		color: colorStyles,
	},
	defaults: {
		size: 'md',
		color: 'primary',
	},
});

const pingAnimatingDotStyles = styles({
	base: 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
	variants: {
		color: colorStyles,
	},
	defaults: {
		color: 'primary',
	},
});

const pingSolidDotStyles = styles({
	base: 'relative inline-flex rounded-full shadow-sm',
	variants: {
		size: sizeVariants,
		color: colorStyles,
	},
	defaults: {
		size: 'md',
		color: 'primary',
	},
});

type PingVariantProps = StyleProps<typeof pingStyles>;

export interface PingProps
	extends
		Omit<HTMLAttributes<HTMLSpanElement>, keyof PingVariantProps>,
		PingVariantProps {}

export function Ping({
	size = pingStyles.defaults.size,
	color = pingStyles.defaults.color,
	className = '',
	...props
}: PingProps) {
	return (
		<span
			{...props}
			{...pingStyles.render({ size, color, className })}
		>
			<span {...pingAnimatingDotStyles.render({ color })}></span>
			<span {...pingSolidDotStyles.render({ size, color })}></span>
		</span>
	);
}
