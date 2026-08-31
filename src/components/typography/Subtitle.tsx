import React from 'react';
import { StyleProps, styles } from '../../style-engine';
import { textColors } from '@/colors';

export const subtitleStyles = styles({
	base: '',
	variants: {
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			'2xl': 'text-2xl',
		},
		weight: {
			light: 'font-extralight',
			lighter: 'font-light',
			normal: 'font-normal',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
		uppercase: {
			true: 'uppercase',
			false: '',
		},
		letterSpacing: {
			tighest: 'tracking-tighest',
			tight: 'tracking-tight',
			normal: 'tracking-normal',
			wide: 'tracking-wide',
			widest: 'tracking-widest',
		},
		color: textColors,
		margin: {
			0: 'mb-0',
			1: 'mb-1',
			2: 'mb-2',
			4: 'mb-4',
			6: 'mb-6',
		},
	},
	defaults: {
		size: 'md',
		weight: 'semibold',
		color: 'primary',
		uppercase: true,
		letterSpacing: 'widest',
		margin: 2,
	},
});

type SubtitleVariantProps = StyleProps<typeof subtitleStyles>;

export interface SubtitleProps
	extends
		Omit<React.ComponentProps<'p'>, keyof SubtitleVariantProps>,
		SubtitleVariantProps {}

export function Subtitle({
	size,
	weight,
	color,
	uppercase,
	letterSpacing,
	className = '',
	...props
}: SubtitleProps) {
	return (
		<p
			{...subtitleStyles.render({
				size,
				weight,
				color,
				uppercase,
				letterSpacing,
				className,
			})}
			{...props}
		/>
	);
}
