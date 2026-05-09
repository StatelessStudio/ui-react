import React from 'react';
import { colorStyles } from '@/colors';
import { styles, StyleProps } from '@/style-engine';
import { feedbackStyles } from './shared';

const alertVariants = new Set<AlertColor>(['warning', 'danger']);

const alertStyles = styles({
	base: [feedbackStyles.base, 'shadow-sm'],
	variants: {
		color: colorStyles,
	},
	defaults: {
		color: 'info',
	},
});

type AlertVariantProps = StyleProps<typeof alertStyles>;
type AlertColor = NonNullable<AlertVariantProps['color']>;

export interface AlertProps
	extends
		Omit<React.ComponentProps<'div'>, 'title' | 'color'>,
		AlertVariantProps {
	title?: React.ReactNode;
	icon?: React.ReactNode;
}

export function Alert({
	title,
	icon,
	children,
	color = alertStyles.defaults.color,
	className = '',
	role: roleProp,
	'aria-live': ariaLiveProp,
	...props
}: AlertProps) {
	const role = roleProp ?? (alertVariants.has(color!) ? 'alert' : 'status');
	const ariaLive = ariaLiveProp ?? (role === 'alert' ? 'assertive' : 'polite');

	return (
		<div
			role={role}
			aria-live={ariaLive}
			{...props}
			{...alertStyles.render({ color, className })}
		>
			<div className="flex w-full items-start gap-3">
				{icon && (
					<div
						aria-hidden="true"
						className="flex-shrink-0 w-5 h-5 mt-0.5"
					>
						{icon}
					</div>
				)}
				<div className="flex-1">
					{title && <p className={feedbackStyles.title}>{title}</p>}
					{children && (
						<div className={feedbackStyles.description}>{children}</div>
					)}
				</div>
			</div>
		</div>
	);
}
