'use client';
import { TextareaHTMLAttributes } from 'react';

import { StyleProps } from '@/style-engine';
import { FormElementProps } from './types';
import { formStyles } from './styles';
import { useFormFieldAria } from './useFormFieldAria';

const textareaStyles = formStyles.extend({
	base: 'transition-colors min-h-[80px] resize-y',
});

type TextareaStyleProps = StyleProps<typeof textareaStyles>;

export interface TextareaProps
	extends
		Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextareaStyleProps>,
		TextareaStyleProps,
		FormElementProps {}

export function Textarea({
	size = textareaStyles.defaults.size,
	invalid,
	error,
	errorId,
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: TextareaProps) {
	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': ariaInvalidProp,
		'aria-describedby': ariaDescribedByProp,
	});

	return (
		<textarea
			id={id}
			{...textareaStyles.render({
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
