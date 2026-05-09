'use client';
import { SelectHTMLAttributes, ReactNode } from 'react';
import { styles, StyleProps, cn } from '@/style-engine';
import { ChevronDownIcon } from '@/icons';
import { FormElementProps } from './types';
import { formStyles } from './styles';
import { useFormFieldAria } from './useFormFieldAria';

const selectStyles = formStyles.extend({
	base:
		'transition-colors bg-background appearance-none cursor-pointer ' +
		'text-foreground pr-8 ' +
		'focus:ring-1 focus:ring-offset-0',
	variants: {
		state: {
			default:
				'border-border bg-background ' +
				'focus:ring-1 focus:ring-offset-0 focus:ring-primary focus:border-primary',
			error:
				'border-danger ' +
				'focus:ring-1 focus:ring-offset-0 focus:ring-danger focus:border-danger',
		},
	},
});

const chevronStyles = styles({
	base:
		'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ' +
		'text-foreground',
	variants: {
		state: {
			disabled: 'text-muted',
		},
	},
});

type SelectStyleProps = StyleProps<typeof selectStyles>;

export interface SelectProps
	extends
		Omit<
			SelectHTMLAttributes<HTMLSelectElement>,
			'size' | keyof SelectStyleProps
		>,
		SelectStyleProps,
		FormElementProps {
	children: ReactNode;
	containerClassName?: string;
}

export function Select({
	size = selectStyles.defaults.size,
	containerClassName,
	invalid,
	error,
	errorId,
	children,
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: SelectProps) {
	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': ariaInvalidProp,
		'aria-describedby': ariaDescribedByProp,
	});

	return (
		<div className={cn('relative w-full', containerClassName)}>
			<select
				id={id}
				{...selectStyles.render({
					size,
					state: isInvalid ? 'error' : 'default',
					className,
				})}
				aria-invalid={ariaInvalid}
				aria-describedby={ariaDescribedBy}
				{...props}
			>
				{children}
			</select>
			<div
				{...chevronStyles.render({
					state: props.disabled ? 'disabled' : undefined,
				})}
			>
				<ChevronDownIcon
					width="16"
					height="16"
				/>
			</div>
		</div>
	);
}
