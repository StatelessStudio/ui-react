import React, { useEffect, useState, useRef } from 'react';
import { cn, styles, StyleProps } from '@/style-engine';
import { ColorVariant, colorStyles } from '@/colors';
import { CloseIcon } from '@/icons';
import { feedbackStyles } from './shared';
import { ProgressBar } from '../progress/ProgressBar';

const toastStyles = styles({
	base: [
		'flex items-start w-full overflow-hidden rounded-lg relative p-4',
		'transition-all ring-1 ring-black/5 shadow-lg max-w-sm pointer-events-auto',
	],
	variants: {
		color: colorStyles,
	},
	defaults: {
		color: 'info',
	},
});

type ToastStyleProps = StyleProps<typeof toastStyles>;

const progressStyles =
	'absolute bottom-0 left-0 right-0 rounded-none bg-black/10 h-1.5';

export interface ToastProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | keyof ToastStyleProps>,
		ToastStyleProps {
	title?: React.ReactNode;
	description?: React.ReactNode;
	onClose?: () => void;
	action?: React.ReactNode;
	icon?: React.ReactNode;
	duration?: number;
	onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
	onFocus?: React.FocusEventHandler<HTMLDivElement>;
	onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

const urgentVariants = new Set<ColorVariant>(['warning', 'danger']);

export function Toast({
	color = 'info',
	title,
	description,
	onClose,
	action,
	icon,
	className = '',
	duration = 5000,
	role: roleProp,
	'aria-live': ariaLiveProp,
	'aria-atomic': ariaAtomicProp,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	...props
}: ToastProps) {
	const role = roleProp ?? (urgentVariants.has(color) ? 'alert' : 'status');
	const ariaLive = ariaLiveProp ?? (role === 'alert' ? 'assertive' : 'polite');
	const ariaAtomic = ariaAtomicProp ?? true;

	const [progress, setProgress] = useState<number>(100);
	const [isPaused, setIsPaused] = useState(false);
	const remainingTimeRef = useRef(duration);
	const lastUpdateTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		if (!duration || duration <= 0) {
			return;
		}

		let frameId: number;

		const tick = () => {
			if (!isPaused) {
				const now = Date.now();
				const delta = now - lastUpdateTimeRef.current;
				remainingTimeRef.current -= delta;
				lastUpdateTimeRef.current = now;

				if (remainingTimeRef.current <= 0) {
					onClose?.();
					return;
				}

				const animationDurationMs = 2000;

				if (remainingTimeRef.current <= animationDurationMs) {
					setProgress((remainingTimeRef.current / animationDurationMs) * 100);
				}
				else {
					setProgress(100);
				}
			}
			else {
				lastUpdateTimeRef.current = Date.now();
			}

			frameId = requestAnimationFrame(tick);
		};

		lastUpdateTimeRef.current = Date.now();
		frameId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frameId);
		};
	}, [duration, isPaused, onClose]);

	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsPaused(true);
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsPaused(false);
		onMouseLeave?.(e);
	};

	const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsPaused(true);
		onFocus?.(e);
	};

	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		setIsPaused(false);
		onBlur?.(e);
	};

	return (
		<div
			{...toastStyles.render({
				color,
				className: cn('overflow-hidden', className),
			})}
			role={role}
			aria-live={ariaLive}
			aria-atomic={ariaAtomic}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			{...props}
		>
			<div className="flex w-full items-start gap-3">
				{icon && (
					<div
						className="flex-shrink-0"
						aria-hidden="true"
					>
						{icon}
					</div>
				)}
				<div className="flex-1">
					{title && <p className={feedbackStyles.title}>{title}</p>}
					{description && (
						<p className={feedbackStyles.description}>{description}</p>
					)}
					{action && (
						<div className={feedbackStyles.actionContainer}>{action}</div>
					)}
				</div>
				{onClose && (
					<div className="ml-4 flex flex-shrink-0">
						<button
							type="button"
							className={cn(feedbackStyles.closeButton, 'text-current')}
							onClick={onClose}
							aria-label="Close"
						>
							<CloseIcon className="h-5 w-5" />
						</button>
					</div>
				)}
			</div>

			<ProgressBar
				value={progress ?? 100}
				max={100}
				color={color}
				className={progressStyles}
				indicatorClassName="transition-none rounded-none"
			/>
		</div>
	);
}
