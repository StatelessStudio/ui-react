'use client';
import {
	useRef,
	useState,
	useEffect,
	useCallback,
	HTMLAttributes,
	ReactNode,
	ChangeEvent,
	KeyboardEvent,
	ClipboardEvent,
	Fragment,
} from 'react';
import { styles } from '@/style-engine';
import { useControllableState } from '@/hooks';

const segmentedInputWrapperStyles = styles({
	base: 'flex items-center',
	variants: {
		layout: {
			separated: 'gap-2',
			grouped: '-space-x-px',
		},
	},
	defaults: {
		layout: 'grouped',
	},
});

const segmentedInputStyles = styles({
	base: [
		'border text-center outline-none transition-all',
		'w-12 h-12 text-lg font-semibold px-0',
	],
	variants: {
		error: {
			true: 'border-danger bg-danger/10 text-danger scale-[1.02] transform z-20',
			false: 'border-border bg-background focus:ring-1 focus:ring-primary',
		},
		layout: {
			separated: 'rounded-md',
			grouped: 'relative rounded-none focus:z-10',
		},
		edge: {
			left: 'rounded-l-md',
			right: 'rounded-r-md',
			both: 'rounded-md',
			none: '',
		},
	},
	defaults: {
		error: 'false',
		layout: 'grouped',
		edge: 'none',
	},
});

export interface SegmentedInputProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'onChange' | 'value' | 'defaultValue'
> {
	/** The controlled value of the input */
	value?: string;

	/** The uncontrolled default value */
	defaultValue?: string;

	/** Number of input segments. Overridden if 'groups' is provided. */
	length?: number;

	/** Array of numbers defining segment groupings. (e.g. [3, 2, 2] for ABC-12-34) */
	groups?: number[];

	/** Custom separator node rendered between groups. Defaults to a dash. */
	separator?: ReactNode;

	/** Input type for each segment */
	type?: 'text' | 'password' | 'number';

	/** Autocomplete behavior. Common value for SMS OTP is "one-time-code" */
	autoComplete?: string;

	/** Callback fired when the combined value changes */
	onChange?: (value: string) => void;

	/** Whether the input is disabled */
	disabled?: boolean;

	/**
	 * Optional per-character validation. If false is returned,
	 * 	the character is rejected.
	 * */
	validateChar?: (char: string, index: number) => boolean;

	/** Visual presentation style. */
	layout?: 'separated' | 'grouped';

	/** Name attribute for native form submission */
	name?: string;
}

export function SegmentedInput({
	value,
	defaultValue = '',
	length = 6,
	groups,
	separator = <span className="mx-1 text-muted-foreground">-</span>,
	type = 'text',
	autoComplete,
	onChange,
	disabled = false,
	validateChar,
	layout = segmentedInputStyles.defaults.layout,
	name,
	className = '',
	...props
}: SegmentedInputProps) {
	const actualLength = groups
		? groups.reduce((acc, curr) => acc + curr, 0)
		: length;

	const handleOnChange = useCallback(
		(newArray: string[]) => onChange?.(newArray.join('')),
		[onChange]
	);

	const [controlValues, setControlValues] = useControllableState<string[]>({
		value: value
			?.split('')
			.concat(Array(actualLength).fill(''))
			.slice(0, actualLength),
		defaultValue: (defaultValue || '')
			.split('')
			.concat(Array(actualLength).fill(''))
			.slice(0, actualLength),
		onChange: handleOnChange,
	});

	let values = controlValues;

	if (values.length !== actualLength) {
		values = values
			.concat(Array(Math.max(0, actualLength - values.length)).fill(''))
			.slice(0, actualLength);
	}

	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const [errorIndices, setErrorIndices] = useState<Record<number, boolean>>({});

	const triggerError = (index: number) => {
		setErrorIndices((prev) => ({ ...prev, [index]: true }));
		setTimeout(() => {
			setErrorIndices((prev) => ({ ...prev, [index]: false }));
		}, 300); // 300ms flash
	};

	// Compute indices after which a separator should be rendered
	const separatorIndices =
		groups?.reduce<number[]>((acc, curr, i) => {
			if (i === groups.length - 1) {
				return acc;
			}

			const prev = acc.length > 0 ? acc[acc.length - 1] : -1;
			acc.push(prev + curr);

			return acc;
		}, []) ?? [];

	const isLeftEdge = (i: number) => {
		if (layout === 'separated') {
			return true;
		}

		if (i === 0) {
			return true;
		}

		return separatorIndices.includes(i - 1);
	};

	const isRightEdge = (i: number) => {
		if (layout === 'separated') {
			return true;
		}

		if (i === actualLength - 1) {
			return true;
		}

		return separatorIndices.includes(i);
	};

	useEffect(() => {
		// Keep refs array correct size
		inputsRef.current = inputsRef.current.slice(0, actualLength);
	}, [actualLength]);

	const triggerChange = (newValues: string[]) => {
		setControlValues(newValues);
	};

	const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		// Handle mobile OTP auto-fill or autocomplete dumping a full string
		if (val.length > 1) {
			let charsToFill = val.split('');
			const newValues = [...values];
			let lastFilledIndex = index;

			for (let i = 0; i < charsToFill.length && index + i < actualLength; i++) {
				const targetIndex = index + i;
				const char = charsToFill[i];

				if (type === 'number' && !/^\d$/.test(char)) {
					triggerError(targetIndex);
					continue;
				}

				if (validateChar && !validateChar(char, targetIndex)) {
					triggerError(targetIndex);
					continue;
				}

				newValues[targetIndex] = char;
				lastFilledIndex = targetIndex;
			}

			triggerChange(newValues);
			const focusIndex =
				lastFilledIndex < actualLength - 1
					? lastFilledIndex + 1
					: actualLength - 1;
			inputsRef.current[focusIndex]?.focus();

			return;
		}

		const newValue = val; // since length is <= 1

		if (newValue) {
			if (type === 'number' && !/^\d$/.test(newValue)) {
				triggerError(index);

				return;
			}

			if (validateChar && !validateChar(newValue, index)) {
				triggerError(index);

				return;
			}
		}

		const newValues = [...values];
		newValues[index] = newValue;
		triggerChange(newValues);

		// Auto-advance
		if (newValue && index < actualLength - 1) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' || e.key === 'Delete') {
			e.preventDefault();
			const newValues = [...values];

			if (e.key === 'Delete' && values[index]) {
				// Clear current but don't focus previous
				newValues[index] = '';
				triggerChange(newValues);
			}
			else if (e.key === 'Backspace') {
				if (values[index]) {
					// Clear current
					newValues[index] = '';
					triggerChange(newValues);
				}
				else if (index > 0) {
					// Clear previous and focus it
					newValues[index - 1] = '';
					triggerChange(newValues);
					inputsRef.current[index - 1]?.focus();
				}
			}
		}
		else if (e.key === 'ArrowLeft' && index > 0) {
			e.preventDefault();
			inputsRef.current[index - 1]?.focus();
		}
		else if (e.key === 'ArrowRight' && index < actualLength - 1) {
			e.preventDefault();
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text');

		if (!pastedData) {
			return;
		}

		// Calculate how many characters we can paste starting from 'index'
		const limit = Math.min(pastedData.length, actualLength - index);
		const charsToPaste = pastedData.slice(0, limit).split('');

		const newValues = [...values];
		let lastFilledIndex = index;

		for (let i = 0; i < charsToPaste.length; i++) {
			const targetIndex = index + i;
			const char = charsToPaste[i];

			if (type === 'number' && !/^\d$/.test(char)) {
				triggerError(targetIndex);
				continue;
			}
			if (validateChar && !validateChar(char, targetIndex)) {
				triggerError(targetIndex);
				continue;
			}

			newValues[targetIndex] = char;
			lastFilledIndex = targetIndex;
		}

		triggerChange(newValues);

		const focusIndex =
			lastFilledIndex < actualLength - 1
				? lastFilledIndex + 1
				: actualLength - 1;

		inputsRef.current[focusIndex]?.focus();
	};

	return (
		<div
			{...segmentedInputWrapperStyles.render({ layout, className })}
			{...props}
		>
			{name && (
				<input
					type="hidden"
					name={name}
					value={values.join('')}
				/>
			)}
			{Array.from({ length: actualLength }).map((_, i) => {
				const leftEdge = isLeftEdge(i);
				const rightEdge = isRightEdge(i);

				return (
					<Fragment key={i}>
						<input
							ref={(el) => {
								inputsRef.current[i] = el;
							}}
							type={type === 'number' ? 'text' : type}
							inputMode={type === 'number' ? 'numeric' : 'text'}
							pattern={type === 'number' ? '[0-9]*' : undefined}
							autoComplete={autoComplete}
							aria-label={`Digit ${i + 1} of ${actualLength}`}
							disabled={disabled}
							value={values[i]}
							onChange={(e) => handleChange(i, e)}
							onKeyDown={(e) => handleKeyDown(i, e)}
							onPaste={(e) => handlePaste(i, e)}
							onFocus={(e) => e.target.select()}
							{...segmentedInputStyles.render({
								error: errorIndices[i] ? 'true' : 'false',
								layout,
								edge:
									leftEdge && rightEdge
										? 'both'
										: leftEdge
											? 'left'
											: rightEdge
												? 'right'
												: 'none',
							})}
						/>
						{separatorIndices.includes(i) && separator}
					</Fragment>
				);
			})}
		</div>
	);
}
