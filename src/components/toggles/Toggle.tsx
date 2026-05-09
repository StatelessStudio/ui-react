import { ComponentPropsWithRef } from 'react';
import { styles, StyleProps } from '@/style-engine';
import { useFormFieldAria } from '../forms/useFormFieldAria';
import { FormElementProps } from '../forms/types';

const labelStyles = styles({
	base: 'relative inline-flex items-center cursor-pointer',
	variants: {
		disabled: { true: 'cursor-not-allowed' },
	},
});

const toggleTrackStyles = styles({
	base:
		'relative inline-block rounded-full bg-muted ' +
		'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 ' +
		'after:content-[""] after:absolute after:bg-background after:border-muted ' +
		'after:border after:rounded-full after:transition-all ' +
		'peer-checked:after:border-background ' +
		'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full',
	variants: {
		size: {
			sm: 'w-7 h-4 after:top-[2px] after:start-[2px] after:h-3 after:w-3',
			lg: 'w-11 h-6 after:top-[2px] after:start-[2px] after:h-5 after:w-5',
		},
		color: {
			primary: 'peer-checked:bg-primary peer-focus:ring-primary',
			secondary: 'peer-checked:bg-secondary peer-focus:ring-secondary',
			accent: 'peer-checked:bg-accent peer-focus:ring-accent',
			muted: 'peer-checked:bg-muted peer-focus:ring-muted',
			success: 'peer-checked:bg-success peer-focus:ring-success',
			warning: 'peer-checked:bg-warning peer-focus:ring-warning',
			danger: 'peer-checked:bg-danger peer-focus:ring-danger',
			info: 'peer-checked:bg-info peer-focus:ring-info',
			gradient: 'peer-checked:bg-gradient-ui peer-focus:ring-primary',
		},
		invalid: {
			true: 'bg-danger/30 peer-checked:bg-danger peer-focus:ring-danger',
		},
		disabled: {
			true: 'cursor-not-allowed opacity-50 pointer-events-none',
		},
		inverse: {
			true:
				'bg-black/20 peer-checked:bg-white/40 ' +
				'peer-focus:ring-white/50 after:bg-white ' +
				'after:border-transparent peer-checked:after:border-transparent',
		},
	},
	defaults: {
		size: 'sm',
		color: 'primary',
		invalid: false,
		disabled: false,
	},
});

export interface ToggleProps
	extends
		Omit<
			ComponentPropsWithRef<'input'>,
			'type' | 'size' | 'color' | 'disabled' | 'className'
		>,
		Omit<StyleProps<typeof toggleTrackStyles>, 'invalid'>,
		FormElementProps {
	className?: string;
}

export function Toggle({
	invalid,
	error,
	errorId,
	size = toggleTrackStyles.defaults.size,
	color = toggleTrackStyles.defaults.color,
	disabled,
	inverse,
	'aria-invalid': ariaInvalidProp,
	'aria-describedby': ariaDescribedByProp,
	className = '',
	...props
}: ToggleProps) {
	const { id, isInvalid, ariaInvalid, ariaDescribedBy } = useFormFieldAria({
		id: props.id,
		invalid,
		error,
		errorId,
		'aria-invalid': ariaInvalidProp,
		'aria-describedby': ariaDescribedByProp,
	});

	return (
		<label {...labelStyles.render({ disabled, className })}>
			<input
				type="checkbox"
				id={id}
				role="switch"
				className="sr-only peer"
				disabled={disabled ? true : undefined}
				aria-invalid={ariaInvalid}
				aria-describedby={ariaDescribedBy}
				aria-checked={props.checked ?? props.defaultChecked ?? false}
				{...props}
			/>
			<div
				{...toggleTrackStyles.render({
					size,
					color,
					inverse,
					disabled,
					invalid: isInvalid,
				})}
			/>
		</label>
	);
}
