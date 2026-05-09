import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useControllableState } from '@/hooks';
import { StyleProps } from '@/style-engine';
import { buttonStyles } from './Button';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';

const toggleGroupItemStyles = buttonStyles.extend({
	variants: {
		state: {
			on: 'relative z-10',
			off: '',
		},
	},
	defaults: { state: 'off', fill: 'outline' },
});

type ToggleGroupItemVariantProps = StyleProps<typeof toggleGroupItemStyles>;
type ToggleGroupAppearance = Pick<
	ToggleGroupItemVariantProps,
	'size' | 'color' | 'fill'
>;

type SingleToggleGroupProps = {
	type: 'single';
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string | undefined) => void;
};

type MultipleToggleGroupProps = {
	type: 'multiple';
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = (
	| SingleToggleGroupProps
	| MultipleToggleGroupProps
) &
	Omit<ButtonGroupProps, 'onChange'> &
	ToggleGroupAppearance & {
		disabled?: boolean;
	};

type ToggleGroupContextValue = {
	type: 'single' | 'multiple';
	value: string | string[];
	onValueChange: (value: string) => void;
	disabled?: boolean;
} & ToggleGroupAppearance;

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export function ToggleGroup(props: ToggleGroupProps) {
	const {
		type,
		value: controlledValue,
		defaultValue,
		onValueChange,
		disabled,
		size = buttonStyles.defaults.size || 'md',
		color = buttonStyles.defaults.color || 'primary',
		fill = buttonStyles.defaults.fill || 'outline',
		children,
		className = '',
		...restProps
	} = props;

	function getDefaultValue(value: string | string[] | undefined) {
		if (value !== undefined) {
			return value;
		}

		if ('value' in props && props.value === undefined) {
			return type === 'multiple' ? [] : '';
		}

		return undefined;
	}

	const [currentValue, setCurrentValue] = useControllableState<
		string | string[]
	>({
		value: getDefaultValue(controlledValue),
		defaultValue: getDefaultValue(defaultValue),
	});

	const handleValueChange = React.useCallback(
		(itemValue: string) => {
			if (type === 'single') {
				const newValue = currentValue === itemValue ? '' : itemValue;
				setCurrentValue(newValue);
				onValueChange?.(newValue === '' ? undefined : newValue);
			}
			else {
				const currentArray = (currentValue as string[]) || [];
				const newValue = currentArray.includes(itemValue)
					? currentArray.filter((v) => v !== itemValue)
					: [...currentArray, itemValue];

				setCurrentValue(newValue);
				onValueChange?.(newValue);
			}
		},
		[type, currentValue, onValueChange, setCurrentValue]
	);

	const contextValue = useMemo(
		() => ({
			type,
			value: currentValue ?? (type === 'multiple' ? [] : ''),
			onValueChange: handleValueChange,
			disabled,
			size,
			color,
			fill,
		}),
		[type, currentValue, handleValueChange, disabled, size, color, fill]
	);

	return (
		<ToggleGroupContext.Provider value={contextValue}>
			<ButtonGroup
				className={className}
				{...restProps}
			>
				{children}
			</ButtonGroup>
		</ToggleGroupContext.Provider>
	);
}

export type ToggleGroupItemProps<E extends React.ElementType> = Omit<
	Omit<React.ComponentProps<E>, 'as' | keyof ToggleGroupItemVariantProps> &
		Omit<ToggleGroupItemVariantProps, 'state'> & { as?: E },
	'value' | 'onClick'
> & {
	value: string;
	icon?: ReactNode;
};

export function ToggleGroupItem<E extends React.ElementType = 'button'>({
	value,
	children,
	className = '',
	disabled,
	color = toggleGroupItemStyles.defaults.color,
	fill = toggleGroupItemStyles.defaults.fill,
	size = toggleGroupItemStyles.defaults.size,
	as,
	icon,
	...props
}: ToggleGroupItemProps<E>) {
	const context = useContext(ToggleGroupContext);

	if (!context) {
		throw new Error('ToggleGroupItem must be used within a ToggleGroup');
	}

	const isPressed =
		context.type === 'single'
			? context.value === value
			: (context.value as string[]).includes(value);

	const itemDisabled = disabled || context.disabled;
	const itemSize = size || context.size;

	// Choose how to style the active down state vs inactive state.
	// Using solid for pressed, and the context fill (default outline) for inactive.
	const itemFill = isPressed ? 'solid' : fill || context.fill;
	const itemColor = color || context.color;

	const Component = (as ?? 'button') as React.ElementType;

	return (
		<Component
			type={Component === 'button' ? 'button' : undefined}
			disabled={itemDisabled}
			aria-pressed={isPressed}
			data-state={isPressed ? 'on' : 'off'}
			onClick={() => context.onValueChange(value)}
			{...props}
			{...toggleGroupItemStyles.render({
				color: itemColor,
				fill: itemFill,
				size: itemSize,
				state: isPressed ? 'on' : 'off',
				className,
			})}
		>
			{icon && { icon }}
			{children}
		</Component>
	);
}
