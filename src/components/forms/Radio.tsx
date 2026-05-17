import { InputHTMLAttributes } from 'react';
import { checkRadioStyles } from './styles';
import { FormElementProps } from './types';
import { useFormFieldAria } from './useFormFieldAria';

const radioStyles = checkRadioStyles.extend({
	base: 'rounded-full bg-background checked:border-[5px] focus:ring-offset-2',
	variants: {
		state: {
			default: 'border-primary/50 checked:border-primary focus:ring-primary',
			error:
				'border-danger bg-danger/10 checked:border-danger focus:ring-danger',
		},
	},
});

export interface RadioProps
	extends
		Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
		FormElementProps {}

export function Radio({
	invalid,
	error,
	errorId,
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: RadioProps) {
	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': ariaInvalidProp,
		'aria-describedby': ariaDescribedByProp,
	});

	return (
		<input
			type="radio"
			id={id}
			{...radioStyles.render({
				state: isInvalid ? 'error' : 'default',
				className,
			})}
			aria-invalid={ariaInvalid}
			aria-describedby={ariaDescribedBy}
			{...props}
		/>
	);
}
