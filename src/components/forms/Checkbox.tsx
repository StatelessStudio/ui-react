import { InputHTMLAttributes } from 'react';
import { styles } from '@/style-engine';
import { CheckIcon } from '@/icons';
import { FormElementProps } from './types';
import { useFormFieldAria } from './useFormFieldAria';
import { checkRadioStyles } from './styles';

const containerStyles = styles({
	base: 'relative inline-flex items-center justify-center w-4 h-4 shrink-0',
});

const checkboxStyles = checkRadioStyles;

const checkIconStyles = styles({
	base:
		'absolute w-3 h-3 pointer-events-none hidden ' +
		'peer-checked:block peer-disabled:opacity-50 text-white',
});

export interface CheckboxProps
	extends
		Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
		FormElementProps {}

export function Checkbox({
	invalid,
	error,
	errorId,
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: CheckboxProps) {
	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': ariaInvalidProp,
		'aria-describedby': ariaDescribedByProp,
	});

	return (
		<span {...containerStyles.render({ className })}>
			<input
				type="checkbox"
				id={id}
				{...checkboxStyles.render({
					state: isInvalid ? 'error' : 'default',
				})}
				aria-invalid={ariaInvalid}
				aria-describedby={ariaDescribedBy}
				{...props}
			/>
			<CheckIcon
				{...checkIconStyles.render()}
				strokeWidth={4}
			/>
		</span>
	);
}
