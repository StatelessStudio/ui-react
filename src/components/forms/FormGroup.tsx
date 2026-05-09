import { ComponentProps, ReactNode, useId } from 'react';
import { styles } from '@/style-engine';

import { FormFieldContext } from './useFormField';

const formGroupContainerStyles = styles({
	base: 'flex flex-col gap-1.5',
});

const formGroupLabelStyles = styles({
	base: 'text-sm font-medium text-foreground/80',
});

const formGroupErrorStyles = styles({
	base: 'text-xs text-danger',
});

export interface FormGroupProps extends ComponentProps<'div'> {
	label: string;
	htmlFor?: string;
	error?: string;
	required?: boolean;
	children: ReactNode;
	className?: string;
}

export function FormGroup({
	label,
	htmlFor,
	error,
	required,
	children,
	className = '',
	...props
}: FormGroupProps) {
	const generatedId = useId();
	const controlId = htmlFor || `control-${generatedId}`;
	const errorId = error ? `error-${generatedId}` : undefined;

	return (
		<FormFieldContext.Provider
			value={{
				id: controlId,
				error,
				invalid: !!error,
				errorId,
			}}
		>
			<div
				{...formGroupContainerStyles.render({ className })}
				{...props}
			>
				<label
					htmlFor={controlId}
					{...formGroupLabelStyles.render({})}
				>
					{label}
					{required && <span className="text-danger ml-1">*</span>}
				</label>
				{children}
				{error && (
					<span
						id={errorId}
						{...formGroupErrorStyles.render({})}
						aria-live="polite"
					>
						{error}
					</span>
				)}
			</div>
		</FormFieldContext.Provider>
	);
}
