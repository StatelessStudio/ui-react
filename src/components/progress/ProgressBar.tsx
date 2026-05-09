import React from 'react';
import { ColorVariant, colorStyles } from '@/colors';
import { transitionAnimations } from '@/animations';
import { styles, StyleProps } from '@/style-engine';

const sizes = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-4',
};

const trackColors: Record<ColorVariant, string> = {
	primary: 'bg-primary/20',
	secondary: 'bg-secondary/20',
	accent: 'bg-accent/20',
	muted: 'bg-muted/20',
	success: 'bg-success/20',
	warning: 'bg-warning/20',
	danger: 'bg-danger/20',
	info: 'bg-info/20',
	gradient: 'bg-secondary/20',
};

const progressTrackStyles = styles({
	base: 'w-full overflow-hidden rounded-full',
	variants: {
		size: sizes,
		color: trackColors,
	},
	defaults: {
		size: 'md',
		color: 'primary',
	},
});

const progressIndicatorStyles = styles({
	base: ['h-full rounded-full', transitionAnimations.all],
	variants: {
		color: colorStyles,
	},
	defaults: {
		color: 'primary',
	},
});

type ProgressVariantProps = StyleProps<typeof progressTrackStyles>;

export interface ProgressProps
	extends Omit<React.ComponentProps<'div'>, 'color'>, ProgressVariantProps {
	value?: number;
	max?: number;
	indicatorClassName?: string;
}

export function ProgressBar({
	value = 0,
	max = 100,
	indicatorClassName,
	size = progressTrackStyles.defaults.size,
	color = progressTrackStyles.defaults.color,
	className = '',
	...props
}: ProgressProps) {
	const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
	const normalizedValue = Number.isFinite(value)
		? Math.min(Math.max(value, 0), normalizedMax)
		: 0;
	const percentage = (normalizedValue / normalizedMax) * 100;

	return (
		<div
			role="progressbar"
			aria-valuenow={normalizedValue}
			aria-valuemin={0}
			aria-valuemax={normalizedMax}
			{...props}
			{...progressTrackStyles.render({ size, color, className })}
		>
			<div
				{...progressIndicatorStyles.render({
					color,
					className: indicatorClassName,
				})}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}
