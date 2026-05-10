import { Spinner } from './Spinner';
import { animate } from '@/animations';
import { ColorVariant } from '@/colors';
import { CircleCheckIcon, CircleXIcon } from '@/icons';
import { cn } from '@/style-engine';

export function TriState({
	state,
	size = 'sm',
	className = '',
	color = 'primary',
}: {
	state: 'loading' | 'success' | 'error';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	color?: ColorVariant;
}) {
	const iconSize = {
		sm: 18,
		md: 24,
		lg: 32,
	};

	const baseAnimation = animate({
		fadeIn: true,
		zoomIn: true,
		duration: 'medium',
	});

	return (
		<>
			{state === 'loading' && (
				<Spinner
					className={cn(baseAnimation, className)}
					color={color}
					size={size}
				/>
			)}
			{state === 'success' && (
				<CircleCheckIcon
					className={cn(baseAnimation, 'text-success', className)}
					width={iconSize[size]}
					height={iconSize[size]}
				/>
			)}
			{state === 'error' && (
				<CircleXIcon
					className={cn(baseAnimation, 'text-danger', className)}
					width={iconSize[size]}
					height={iconSize[size]}
				/>
			)}
		</>
	);
}
