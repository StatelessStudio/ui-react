'use client';
import {
	useState,
	useEffect,
	useRef,
	InputHTMLAttributes,
	MouseEvent,
	KeyboardEvent,
	useId,
	RefObject,
	Ref,
} from 'react';
import { StyleProps, cn, styles } from '@/style-engine';
import { ChevronDownIcon } from '@/icons';
import { useControllableState, useDebounce } from '@/hooks';
import { FormElementProps } from './types';
import { formStyles } from './styles';
import { Badge } from '../feedback/Badge';
import { Spinner } from '../progress/Spinner';
import { useFormFieldAria } from './useFormFieldAria';

const comboBoxContainerStyles = formStyles.extend({
	base: [
		'relative flex flex-wrap items-center',
		'gap-2 min-h-[42px] py-1.5 px-3 pr-8',
		'cursor-text rounded-md border outline-none transition-colors',
	],
	variants: {},
});

const comboBoxWrapperStyles = styles({
	base: 'relative w-full',
});

const comboBoxInputStyles = styles({
	base: [
		'flex-1 bg-transparent min-w-[60px] outline-none',
		'border-none focus:ring-0 p-0 text-sm disabled:cursor-not-allowed',
	],
});

const comboBoxIconWrapperStyles = styles({
	base: 'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
});

const comboBoxListboxStyles = styles({
	base: [
		'absolute z-10 w-full mt-1 bg-background border border-muted',
		'rounded-md shadow-lg max-h-60 overflow-auto',
	],
});

const comboBoxOptionStyles = styles({
	base: 'px-4 py-2 text-sm',
	variants: {
		state: {
			loading: 'text-foreground',
			empty: 'text-muted',
			default: 'cursor-pointer hover:bg-muted',
		},
		selected: {
			true: 'bg-muted font-medium',
			false: '',
		},
	},
	defaults: {
		state: 'default',
		selected: 'false',
	},
});

const comboBoxBadgeProps = {
	className: 'flex items-center gap-1',
};

const comboBoxRemoveButtonStyles = styles({
	base: [
		'ml-1 hover:text-danger focus:outline-none flex items-center',
		'justify-center leading-none h-4 w-4 rounded-full',
		'hover:bg-black/10 transition-colors',
	],
});

type ComboBoxStyleProps = StyleProps<typeof comboBoxContainerStyles>;

export interface ComboBoxOption {
	value: string | number;
	label: string;
}

export interface ComboBoxProps<IsMulti extends boolean = false>
	extends
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'value'
			| 'onChange'
			| 'type'
			| 'size'
			| 'color'
			| keyof ComboBoxStyleProps
		>,
		ComboBoxStyleProps,
		FormElementProps {
	ref?: Ref<HTMLInputElement>;
	loadOptions: (inputValue: string) => Promise<ComboBoxOption[]>;
	isMulti?: IsMulti;
	value?: (IsMulti extends true ? ComboBoxOption[] : ComboBoxOption) | null;
	onChange?: (
		val: IsMulti extends true ? ComboBoxOption[] : ComboBoxOption
	) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	debounceTime?: number;
	noOptionsMessage?: string;
	containerClassName?: string;
}

export function ComboBox<IsMulti extends boolean = false>({
	containerClassName,
	invalid,
	error,
	errorId,
	loadOptions,
	isMulti,
	value = null,
	onChange,
	open,
	defaultOpen = false,
	onOpenChange,
	placeholder = 'Search...',
	debounceTime = 300,
	noOptionsMessage = 'No options found',
	disabled,
	size = comboBoxContainerStyles.defaults.size,
	state = comboBoxContainerStyles.defaults.state,
	ref,
	...props
}: ComboBoxProps<IsMulti>) {
	const [isOpen, setIsOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const [inputValue, setInputValue] = useState('');
	const [options, setOptions] = useState<ComboBoxOption[]>([]);
	const [loading, setLoading] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': props['aria-invalid'],
		'aria-describedby': props['aria-describedby'],
	});

	// Single select: show label when closed. Multi-select: always empty when closed.
	useEffect(() => {
		if (!isOpen) {
			if (!isMulti && value && !Array.isArray(value)) {
				setInputValue(value.label);
			}
			else {
				setInputValue('');
			}
		}
	}, [value, isOpen, isMulti]);

	// Debounced search
	const activeRequestRef = useRef<symbol | null>(null);

	const fetchOptions = useDebounce((currentInput: string) => {
		const requestId = Symbol('request');
		activeRequestRef.current = requestId;

		loadOptions(currentInput)
			.then((res) => {
				if (activeRequestRef.current !== requestId) {
					return;
				}

				// Filter out already selected if multi
				if (isMulti && Array.isArray(value)) {
					const filtered = res.filter(
						(opt) => !value.some((val) => val.value === opt.value)
					);
					setOptions(filtered);
				}
				else {
					setOptions(res);
				}

				setLoading(false);
			})
			.catch(() => {
				if (activeRequestRef.current !== requestId) {
					return;
				}
				setOptions([]);
				setLoading(false);
			});
	}, debounceTime);

	useEffect(() => {
		if (!isOpen) {
			setLoading(false);
			fetchOptions.cancel();
			return;
		}

		setLoading(true);
		fetchOptions(inputValue);

		return () => fetchOptions.cancel();
	}, [inputValue, isOpen, fetchOptions]);

	// Click outside to close
	useEffect(() => {
		function handleOutsideClick(event: Event) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);

				if (!isMulti && value && !Array.isArray(value)) {
					setInputValue(value.label);
				}
				else {
					setInputValue('');
				}
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, [value, isMulti]);

	const handleSelect = (option: ComboBoxOption) => {
		if (isMulti) {
			const currentValues = Array.isArray(value) ? value : [];

			const isAlreadySelected = currentValues.some(
				(v) => v.value === option.value
			);
			const nextValues = isAlreadySelected
				? currentValues.filter((v) => v.value !== option.value)
				: [...currentValues, option];

			onChange?.(
				nextValues as IsMulti extends true ? ComboBoxOption[] : ComboBoxOption
			);

			setInputValue('');
			inputRef.current?.focus();
		}
		else {
			setInputValue(option.label);
			setIsOpen(false);
			onChange?.(
				option as IsMulti extends true ? ComboBoxOption[] : ComboBoxOption
			);
		}
	};

	const handleRemove = (e: MouseEvent, optionToRemove: ComboBoxOption) => {
		e.stopPropagation();
		if (isMulti && Array.isArray(value)) {
			onChange?.(
				value.filter(
					(v) => v.value !== optionToRemove.value
				) as IsMulti extends true ? ComboBoxOption[] : ComboBoxOption
			);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
				e.preventDefault();
				setIsOpen(true);
				return;
			}
		}
		else {
			if (e.key === 'Escape') {
				setIsOpen(false);
				return;
			}
		}

		if (
			e.key === 'Backspace' &&
			!inputValue &&
			isMulti &&
			Array.isArray(value) &&
			value.length > 0
		) {
			const newValues = [...value];
			newValues.pop();
			onChange?.(
				newValues as IsMulti extends true ? ComboBoxOption[] : ComboBoxOption
			);
		}
		else if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			// Optionally handle Exact Match Or Custom
			const exactMatch = options.find(
				(o) => o.label.toLowerCase() === inputValue.trim().toLowerCase()
			);
			if (exactMatch) {
				handleSelect(exactMatch);
			}
		}
	};

	const containerClasses = comboBoxContainerStyles.render({
		size,
		state: isInvalid ? 'error' : state,
		className: cn(
			disabled ? 'opacity-50 cursor-not-allowed' : '',
			props.className
		),
	}).className;

	const selectedOptions = isMulti && Array.isArray(value) ? value : [];
	const singleSelectedOption =
		!isMulti && value && !Array.isArray(value) ? value : null;

	const uid = useId();
	const listboxId = `combobox-listbox-${uid}`;

	return (
		<div
			ref={containerRef}
			{...comboBoxWrapperStyles.render({ className: containerClassName })}
			role="group"
		>
			<div
				className={containerClasses}
				onClick={() => {
					if (!disabled) {
						setIsOpen(true);
						inputRef.current?.focus();
						if (!isMulti && !isOpen) {
							// clear single select input to allow new searches
							setInputValue('');
						}
					}
				}}
			>
				{/* Render Badges/Tags if multi-select */}
				{isMulti &&
					selectedOptions.map((opt) => (
						<Badge
							key={opt.value}
							color="secondary"
							{...comboBoxBadgeProps}
						>
							{opt.label}
							{!disabled && (
								<button
									type="button"
									{...comboBoxRemoveButtonStyles.render()}
									onClick={(e) => handleRemove(e, opt)}
									aria-label={`Remove ${opt.label}`}
								>
									&times;
								</button>
							)}
						</Badge>
					))}

				<input
					{...props}
					id={id}
					ref={(node) => {
						inputRef.current = node;
						if (typeof ref === 'function') {
							ref(node);
						}
						else if (ref) {
							(ref as RefObject<HTMLInputElement | null>).current = node;
						}
					}}
					type="text"
					{...comboBoxInputStyles.render()}
					placeholder={
						!isMulti && singleSelectedOption && !isOpen
							? ''
							: isMulti && selectedOptions.length > 0
								? ''
								: placeholder
					}
					value={inputValue}
					disabled={disabled}
					onChange={(e) => {
						setInputValue(e.target.value);
						setIsOpen(true);
					}}
					onKeyDown={handleKeyDown}
					aria-invalid={ariaInvalid}
					aria-describedby={ariaDescribedBy}
					role="combobox"
					aria-expanded={isOpen}
					aria-autocomplete="list"
					aria-controls={isOpen ? listboxId : undefined}
					// TODO: Implement active descendant tracking if needed
					aria-activedescendant={undefined}
				/>

				<div {...comboBoxIconWrapperStyles.render()}>
					{loading ? (
						<Spinner
							className="h-4 w-4"
							color="primary"
						/>
					) : (
						<ChevronDownIcon
							className="text-muted"
							width="16"
							height="16"
						/>
					)}
				</div>
			</div>

			{isOpen && !disabled && (
				<div
					id={listboxId}
					role="listbox"
					{...comboBoxListboxStyles.render()}
				>
					{loading && options.length === 0 ? (
						<div
							role="option"
							aria-selected="false"
							{...comboBoxOptionStyles.render({ state: 'loading' })}
						>
							Loading...
						</div>
					) : !loading && options.length === 0 ? (
						<div
							role="option"
							aria-selected="false"
							{...comboBoxOptionStyles.render({ state: 'empty' })}
						>
							{noOptionsMessage}
						</div>
					) : (
						options.map((option) => {
							const isSelected = isMulti
								? selectedOptions.some((o) => o.value === option.value)
								: (singleSelectedOption as ComboBoxOption)?.value ===
									option.value;

							return (
								<div
									key={option.value}
									role="option"
									aria-selected={isSelected}
									{...comboBoxOptionStyles.render({
										selected: isSelected ? 'true' : 'false',
									})}
									onClick={() => handleSelect(option)}
								>
									{option.label}
								</div>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}
