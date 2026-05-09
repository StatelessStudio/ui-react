import { useFormField } from './useFormField';
import { FormElementProps } from './types';

export function useFormFieldAria(
	props: FormElementProps & {
		id?: string;
		'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
		'aria-describedby'?: string;
	}
) {
	const fieldContext = useFormField();

	const isInvalid =
		props.invalid ??
		fieldContext?.invalid ??
		(!!props.error || !!fieldContext?.error);
	const errorId = props.errorId ?? fieldContext?.errorId;
	const id = props.id ?? fieldContext?.id;

	const ariaInvalid = props['aria-invalid'] ?? (isInvalid ? 'true' : undefined);

	const ariaDescribedBy =
		[props['aria-describedby'], isInvalid && errorId ? errorId : undefined]
			.filter(Boolean)
			.join(' ') || undefined;

	return { id, isInvalid, ariaInvalid, ariaDescribedBy, errorId };
}
