import { ReactNode } from 'react';
import { ColorVariant } from '@/colors';
import { cn } from '@/style-engine';
import { Button, ButtonProps } from './Button';
import { TriState } from '../progress';
import { animate } from '@/animations';

const animation = animate({
	transitionColors: true,
	duration: 'short',
});

export function TriStateButton({
	children,
	state,
	size = 'md',
	className = '',
	color = 'primary',
	...props
}: {
	children?: ReactNode;
	state: null | 'loading' | 'success' | 'error';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	color?: ColorVariant;
} & ButtonProps<'button'>) {
	const getButtonColor = () => {
		if (state === 'loading') {
			return color;
		}
		if (state === 'success') {
			return 'success';
		}
		if (state === 'error') {
			return 'danger';
		}
		return color;
	};

	return (
		<Button
			color={getButtonColor()}
			className={cn(animation, 'disabled:opacity-90', className)}
			size={size}
			disabled={state !== null}
			{...props}
		>
			{state === null && children}
			{state !== null && (
				<TriState
					state={state}
					size={size}
					className="text-white"
				/>
			)}
		</Button>
	);
}
