import { createContext, useContext } from 'react';

type FormFieldContextValue = {
	id: string;
	name?: string;
	error?: string;
	invalid?: boolean;
	errorId?: string;
};

export const FormFieldContext = createContext<FormFieldContextValue | null>(
	null
);

export function useFormField() {
	return useContext(FormFieldContext);
}
