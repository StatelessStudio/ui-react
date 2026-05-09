import React from 'react';
import { styles, StyleProps } from '@/style-engine';
import { BoxIcon } from '@/icons';

const emptyStateStyles = styles({
	base: [
		'flex flex-col items-center justify-center p-8 text-center',
		'border border-dashed border-neutral-300 rounded-lg',
	],
});

const emptyStateIconStyles = styles({
	base: 'mb-4',
});

const emptyStateTitleStyles = styles({
	base: 'mb-1 font-medium',
});

const emptyStateDescriptionStyles = styles({
	base: 'mb-4 text-sm',
});

type EmptyStateVariantProps = StyleProps<typeof emptyStateStyles>;

export interface EmptyStateProps
	extends
		Omit<
			React.HTMLAttributes<HTMLDivElement>,
			'title' | keyof EmptyStateVariantProps
		>,
		EmptyStateVariantProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	action?: React.ReactNode;
}

export function EmptyState({
	title,
	description,
	icon = <BoxIcon className="w-12 h-12" />,
	action,
	className = '',
	...props
}: EmptyStateProps) {
	return (
		<div
			{...props}
			{...emptyStateStyles.render({ className })}
		>
			{icon && <div {...emptyStateIconStyles.render({})}>{icon}</div>}
			<div {...emptyStateTitleStyles.render({})}>{title}</div>
			{description && (
				<div {...emptyStateDescriptionStyles.render({})}>{description}</div>
			)}
			{action && <div>{action}</div>}
		</div>
	);
}
