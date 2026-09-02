import React from 'react';
import { styles, StyleProps } from '@/style-engine';
import { Stack } from '@/index';

const objectLabelStyles = styles({
	base: 'items-center',
	variants: {
		gap: {
			sm: 'gap-2',
			md: 'gap-3',
			lg: 'gap-4',
		},
	},
	defaults: {
		gap: 'md',
	},
});

type ObjectLabelVariantProps = StyleProps<typeof objectLabelStyles>;

/**
 * Props for the ObjectLabel component
 */
export interface ObjectLabelProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, keyof ObjectLabelVariantProps>,
		ObjectLabelVariantProps {
	/** The object to display (icon, image, avatar, etc.) */
	object: React.ReactNode;
	/** Label text or JSX to display below the object */
	label: string | React.ReactNode;
	/** Spacing between the object and label */
	gap?: 'sm' | 'md' | 'lg';
}

/**
 * Displays an object (icon, image, avatar, etc.) with a label below it.
 * Useful for showing visual elements with associated text in a
 * vertically-aligned layout.
 *
 * @example
 * ```tsx
 * <ObjectLabel
 *   object={<UserIcon />}
 *   label="John Doe"
 * />
 * ```
 */
export function ObjectLabel({
	object,
	label,
	gap = objectLabelStyles.defaults.gap,
	className = '',
	...props
}: ObjectLabelProps) {
	return (
		<Stack
			{...props}
			{...objectLabelStyles.render({ gap, className })}
		>
			<div className="items-center">{object}</div>
			{label}
		</Stack>
	);
}

ObjectLabel.displayName = 'ObjectLabel';
