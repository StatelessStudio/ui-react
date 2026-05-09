import React from 'react';
import { styles, StyleProps } from '../../style-engine';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const levelMargins: Record<HeadingLevel, string> = {
	1: 'mt-8 mb-4',
	2: 'mt-8 mb-4',
	3: 'mt-6 mb-3',
	4: 'mt-6 mb-2',
	5: 'mt-4 mb-2',
	6: 'mt-4 mb-2',
};

const headingStyles = styles({
	base: 'font-bold first:mt-0',
	variants: {
		level: {
			1: 'text-3xl',
			2: 'text-2xl',
			3: 'text-xl',
			4: 'text-lg',
			5: 'text-base',
			6: 'text-sm',
		},
		margin: {
			default: '',
			none: '',
		},
	},
	defaults: {
		level: 1,
		margin: 'default',
	},
	rules: (options) => {
		if (options.margin === 'none') {
			return undefined;
		}

		return levelMargins[options.level ?? 1];
	},
});

type HeadingVariantProps = StyleProps<typeof headingStyles> & {
	level: HeadingLevel;
};

export interface HeadingProps
	extends
		Omit<React.ComponentPropsWithoutRef<'h1'>, keyof HeadingVariantProps>,
		HeadingVariantProps {}

export function Heading({
	level = headingStyles.defaults.level as HeadingLevel,
	margin = headingStyles.defaults.margin,
	children,
	className = '',
	...props
}: HeadingProps) {
	const Tag = `h${level}` as const;

	return (
		<Tag
			{...headingStyles.render({ level, margin, className })}
			{...props}
		>
			{children}
		</Tag>
	);
}
