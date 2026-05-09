import { ChangeEvent, useId } from 'react';
import { hasFocusVisibleColors } from '@/colors';
import { styles } from '@/style-engine';
import { Badge, BadgeProps } from '../feedback/Badge';
import { Toggle, ToggleProps } from './Toggle';

const badgeStyles = styles({
	base:
		'relative inline-flex items-center gap-2 pl-3 py-1 cursor-default ' +
		'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2',
	variants: {
		color: hasFocusVisibleColors,
		disabled: {
			true: 'opacity-50',
		},
	},
	defaults: {
		color: 'muted',
		disabled: false,
	},
});

const toggleBadgeLabelStyles = styles({
	base: 'cursor-pointer select-none after:absolute after:inset-0',
	variants: {
		disabled: {
			true: 'cursor-not-allowed',
			false: '',
		},
	},
	defaults: {
		disabled: 'false',
	},
});

export interface ToggleBadgeProps extends Omit<BadgeProps, 'onChange'> {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	name?: string;
	value?: string;
	id?: string;
	size?: 'sm' | 'lg';
	toggleProps?: Partial<ToggleProps>;
}

export function ToggleBadge({
	children,
	className = '',
	checked,
	defaultChecked,
	onCheckedChange,
	disabled,
	name,
	value,
	id,
	size = 'sm',
	color = 'muted',
	toggleProps,
	...badgeProps
}: ToggleBadgeProps) {
	const generatedId = useId();
	const toggleId = id || generatedId;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onCheckedChange?.(e.target.checked);
		toggleProps?.onChange?.(e);
	};

	return (
		<Badge
			color={color}
			{...badgeStyles.render({
				color,
				disabled,
				className,
			})}
			{...badgeProps}
		>
			<label
				htmlFor={toggleId}
				{...toggleBadgeLabelStyles.render({ disabled })}
			>
				{children}
			</label>
			<Toggle
				id={toggleId}
				name={name}
				value={value}
				checked={checked}
				defaultChecked={defaultChecked}
				onChange={handleChange}
				disabled={disabled}
				size={size}
				color={color}
				inverse
				className="m-0 [&>div]:peer-focus:ring-0 [&>div]:peer-focus:ring-offset-0"
				{...toggleProps}
			/>
		</Badge>
	);
}
