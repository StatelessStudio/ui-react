import * as React from 'react';
import { styles, StyleProps } from '../../style-engine';
import { colorStyles } from '../../colors/colors';
import { Heading, HeadingLevel, subtitleStyles } from '../typography';
import { roundingStyles } from '@/styles';

const cardStyles = styles({
	base: 'flex h-full flex-col border border-muted/20 shadow-sm',
	variants: {
		color: {
			...colorStyles,
			none: 'bg-card text-foreground border',
		},
		rounding: roundingStyles,
	},
	defaults: {
		color: 'none',
		rounding: 'xl',
	},
});

type CardVariantProps = StyleProps<typeof cardStyles>;

export interface CardProps
	extends
		Omit<React.ComponentProps<'div'>, keyof CardVariantProps>,
		CardVariantProps {
	actionMenu?: React.ReactNode;
}

export function Card({
	color = cardStyles.defaults.color,
	rounding = cardStyles.defaults.rounding,
	className = '',
	actionMenu,
	...props
}: CardProps) {
	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
			}}
			{...props}
			{...cardStyles.render({ color, rounding, className })}
		>
			{actionMenu && (
				<div
					style={{
						position: 'absolute',
						top: '1rem',
						right: '1rem',
						zIndex: 10,
					}}
				>
					{actionMenu}
				</div>
			)}
			{props.children}
		</div>
	);
}

const cardHeaderStyles = styles({
	base: 'flex flex-col space-y-1.5 p-6 pb-0',
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

const cardActionMenuStyles = styles({
	base: 'absolute top-4 right-4 z-10',
});

export type CardActionMenuProps = React.ComponentProps<'div'>;

export function CardActionMenu({
	className = '',
	...props
}: CardActionMenuProps) {
	return (
		<div
			{...props}
			{...cardActionMenuStyles.render({ className })}
		/>
	);
}

const cardHeaderActionMenuStyles = styles({
	base: 'flex justify-end mt-1 mr-2',
});

export type CardHeaderActionMenuProps = React.ComponentProps<'div'>;

export function CardHeaderActionMenu({
	className = '',
	...props
}: CardHeaderActionMenuProps) {
	return (
		<div
			{...props}
			{...cardHeaderActionMenuStyles.render({ className })}
		/>
	);
}

const cardSubtitleStyles = subtitleStyles.extend({
	defaults: {
		...subtitleStyles.defaults,
		size: 'md',
		margin: 1,
	},
});

type CardSubtitleVariantProps = StyleProps<typeof cardSubtitleStyles>;

export interface CardSubtitleProps
	extends
		Omit<React.ComponentProps<'p'>, keyof CardSubtitleVariantProps>,
		CardSubtitleVariantProps {}

export function CardSubtitle({
	className = '',
	size,
	weight,
	color,
	margin,
	...props
}: CardSubtitleProps) {
	return (
		<p
			{...cardSubtitleStyles.render({ size, weight, color, margin, className })}
			{...props}
		/>
	);
}
