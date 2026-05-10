import { ElementType, ReactNode } from 'react';
import { cn } from '@/style-engine';
import { Card, CardContent } from './Card';
import { Text, Heading } from '../typography';
import { Spinner } from '../progress';
import { ColorVariant } from '@/colors';

export function StatCard(card: {
	label: string;
	value?: string | number;
	icon?: ElementType;
	iconBgColor?: string;
	iconColor?: string;
	color?: ColorVariant;
	children?: ReactNode;
	isLoading?: boolean;
	className?: string;
}) {
	const Icon = card.icon;
	const textClass = card.color
		? 'text-white'
		: 'text-foreground/70 dark:text-gray-200';
	const iconBgClass =
		card.iconBgColor ||
		(card.color ? 'bg-white/10' : 'bg-gray-900/10 dark:bg-white/10');

	return (
		<Card
			key={card.label}
			color={card.color}
			className={card.className}
		>
			<CardContent className="pt-6">
				<div className="flex items-start gap-4">
					{Icon && (
						<div className={cn('p-3 rounded-lg', iconBgClass)}>
							<Icon className={cn('w-5 h-5', card.iconColor || '')} />
						</div>
					)}
					<div>
						<Text
							className={cn(
								'text-xs font-semibold uppercase tracking-wider',
								textClass
							)}
						>
							{card.label}
						</Text>
						{card.isLoading && (
							<div className="mt-2">
								<Spinner size="sm" />
							</div>
						)}
						{!card.isLoading && card.value !== undefined && (
							<Heading
								level={3}
								className="mt-2 mb-0"
							>
								{card.value}
							</Heading>
						)}
						{card.children}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
