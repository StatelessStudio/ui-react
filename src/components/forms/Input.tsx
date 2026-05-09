'use client';
import { InputHTMLAttributes } from 'react';

import { StyleProps } from '@/style-engine';
import { FormElementProps } from './types';
import { formStyles } from './styles';
import { useFormFieldAria } from './useFormFieldAria';

const inputStyles = formStyles.extend({
	base: 'rounded-md border outline-none transition-colors',
	variants: {},
});

type InputStyleProps = StyleProps<typeof inputStyles>;

export interface InputProps
	extends
		Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | keyof InputStyleProps>,
		InputStyleProps,
		FormElementProps {}

export function Input({
	size = inputStyles.defaults.size,
	invalid,
	error,
	errorId,
	type = 'text',
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: InputProps) {
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
			id={id}
			type={type}
			{...inputStyles.render({
				size,
				state: isInvalid ? 'error' : 'default',
				className,
			})}
			aria-invalid={ariaInvalid}
			aria-describedby={ariaDescribedBy}
			{...props}
		/>
	);
}
