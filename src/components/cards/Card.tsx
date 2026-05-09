import * as React from 'react';
import { styles, StyleProps } from '../../style-engine';
import { colorStyles } from '../../colors/colors';
import { Heading, HeadingLevel } from '../typography';

const cardStyles = styles({
	base: 'flex h-full flex-col rounded-xl border border-muted/20 shadow-sm',
	variants: {
		color: { ...colorStyles, none: 'bg-background text-foreground' },
	},
	defaults: {
		color: 'none',
	},
});

type CardVariantProps = StyleProps<typeof cardStyles>;

export interface CardProps
	extends
		Omit<React.ComponentProps<'div'>, keyof CardVariantProps>,
		CardVariantProps {}

export function Card({
	color = cardStyles.defaults.color,
	className = '',
	...props
}: CardProps) {
	return (
		<div
			{...props}
			{...cardStyles.render({ color, className })}
		/>
	);
}

const cardHeaderStyles = styles({
	base: 'flex flex-col space-y-1.5 p-6 pb-0',
	variants: {},
	defaults: {},
});

export function CardHeader({
	className = '',
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			{...props}
			{...cardHeaderStyles.render({ className })}
		/>
	);
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: HeadingLevel;
}

export function CardTitle({ level = 2, ...props }: CardTitleProps) {
	return (
		<Heading
			level={level}
			{...props}
		/>
	);
}

const cardDescriptionStyles = styles({
	base: 'mb-4 text-sm text-muted-foreground',
	variants: {},
	defaults: {},
});

export function CardDescription({
	className = '',
	...props
}: React.ComponentProps<'p'>) {
	return (
		<p
			{...props}
			{...cardDescriptionStyles.render({ className })}
		/>
	);
}

const cardContentStyles = styles({
	base: 'flex-1 p-6 pt-0',
	variants: {},
	defaults: {},
});

export function CardContent({
	className = '',
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			{...props}
			{...cardContentStyles.render({ className })}
		/>
	);
}

const cardFooterStyles = styles({
	base: 'flex items-center p-6 pt-0',
	variants: {},
	defaults: {},
});

export function CardFooter({
	className = '',
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			{...props}
			{...cardFooterStyles.render({ className })}
		/>
	);
}
