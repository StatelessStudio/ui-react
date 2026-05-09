import { useState, HTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import { styles } from '@/style-engine';
import { StarIcon } from '@/icons';
import { ColorVariant, textColors } from '@/colors/colors';
import { useControllableState } from '@/hooks';

const ratingStyles = styles({
	base:
		'inline-flex items-center gap-1 rounded-sm focus:outline-none ' +
		'focus-visible:ring-2 focus-visible:ring-primary ' +
		'focus-visible:ring-offset-2',
	variants: {
		disabled: {
			true: 'opacity-50 cursor-not-allowed',
			false: 'cursor-pointer',
		},
	},
	defaults: {
		disabled: false,
	},
});

const ratingItemStyles = styles({
	base: 'select-none transition-colors',
	variants: {
		filled: {
			true: '',
			false: 'text-muted-foreground hover:opacity-80',
		},
	},
});

export interface RatingProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'onChange'
> {
	value?: number;
	defaultValue?: number;
	onChange?: (value: number) => void;
	max?: number;
	readOnly?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	name?: string;
	color?: ColorVariant;
	icon?: ReactNode;
	emptyIcon?: ReactNode;
	renderIcon?: (
		index: number,
		isFilled: boolean,
		isHovered: boolean
	) => ReactNode;
}

export function Rating({
	value,
	defaultValue = 0,
	onChange,
	max = 5,
	readOnly = false,
	disabled = false,
	allowClear = true,
	name,
	color = 'primary',
	icon,
	emptyIcon,
	renderIcon,
	className = '',
	...props
}: RatingProps) {
	const [currentValue, setCurrentValue] = useControllableState<number>({
		value,
		defaultValue,
		onChange,
	});
	const [hoverValue, setHoverValue] = useState<number | null>(null);

	const displayValue = hoverValue !== null ? hoverValue : currentValue;

	const activeColorClass = textColors[color];

	const defaultIcon = icon || <StarIcon className="w-6 h-6 fill-current" />;
	const defaultEmptyIcon = emptyIcon || (
		<StarIcon
			className="w-6 h-6 fill-none stroke-current"
			strokeWidth={1.5}
		/>
	);

	const handleClick = (index: number) => {
		if (readOnly || disabled) {
			return;
		}

		const clickedValue = index + 1;

		// Allow clearing the rating if clicking the currently active exact value
		const newValue =
			allowClear && currentValue === clickedValue ? 0 : clickedValue;

		setCurrentValue(newValue);

		if (readOnly || disabled) {
			return;
		}

		setHoverValue(null);
	};

	const handleMouseEnter = (index: number) => {
		if (readOnly || disabled) {
			return;
		}

		setHoverValue(index + 1);
	};

	const handleMouseLeave = () => {
		if (readOnly || disabled) {
			return;
		}

		setHoverValue(null);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (readOnly || disabled) {
			return;
		}

		let newValue = currentValue;

		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			newValue = Math.min(max, currentValue + 1);
			e.preventDefault();
		}
		else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			newValue = Math.max(1, currentValue - 1);
			e.preventDefault();
		}
		else if (e.key === 'Home') {
			newValue = 1;
			e.preventDefault();
		}
		else if (e.key === 'End') {
			newValue = max;
			e.preventDefault();
		}

		if (newValue !== currentValue) {
			setCurrentValue(newValue);
		}
	};

	return (
		<div
			{...ratingStyles.render({
				disabled: disabled ? 'true' : 'false',
				className,
			})}
			role="slider"
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuenow={currentValue}
			aria-valuetext={`${currentValue} out of ${max} stars`}
			tabIndex={disabled || readOnly ? -1 : 0}
			onKeyDown={handleKeyDown}
			onMouseLeave={handleMouseLeave}
			aria-disabled={disabled}
			aria-readonly={readOnly}
			{...props}
		>
			{name && (
				<input
					type="hidden"
					name={name}
					value={currentValue}
				/>
			)}
			{Array.from({ length: max }).map((_, i) => {
				const isFilled = i < displayValue;
				const isHovered = hoverValue !== null && i < hoverValue;

				let iconNode = renderIcon
					? renderIcon(i, isFilled, isHovered)
					: isFilled
						? defaultIcon
						: defaultEmptyIcon;

				return (
					<div
						key={i}
						{...ratingItemStyles.render({
							filled: isFilled ? 'true' : 'false',
							className: isFilled ? activeColorClass : '',
						})}
						onClick={() => handleClick(i)}
						onMouseEnter={() => handleMouseEnter(i)}
					>
						{iconNode}
					</div>
				);
			})}
		</div>
	);
}
