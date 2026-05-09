import React from 'react';
import { styles, StyleProps } from '@/style-engine';

const skeletonStyles = styles({
	base: 'animate-pulse bg-muted',
	variants: {
		variant: {
			text: 'h-4 w-full rounded',
			circular: 'rounded-full shrink-0',
			rectangular: 'rounded-md',
		},
	},
	defaults: {
		variant: 'rectangular',
	},
});

type SkeletonVariantProps = StyleProps<typeof skeletonStyles>;

export interface SkeletonProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, keyof SkeletonVariantProps>,
		SkeletonVariantProps {}

export function Skeleton({
	variant = skeletonStyles.defaults.variant,
	className = '',
	...props
}: SkeletonProps) {
	return (
		<div
			aria-hidden="true"
			{...props}
			{...skeletonStyles.render({ variant, className })}
		/>
	);
}
