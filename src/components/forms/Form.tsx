'use client';

import { ComponentProps, ReactNode, FormEvent } from 'react';
import { cn } from '@/style-engine';
import { animate } from '@/animations';
import { useControllableState } from '@/hooks';
import { TriStateButton } from '../buttons';
import { Alert } from '../feedback';

export interface FormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
	children: ReactNode;
	onSubmit?: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
	isLoading?: boolean;
	defaultIsLoading?: boolean;
	onLoadingChange?: (isLoading: boolean) => void;
	error?: string | null;
	defaultError?: string | null;
	onErrorChange?: (error: string | null) => void;
	success?: string | boolean | null;
	defaultSuccess?: string | boolean | null;
	onSuccessChange?: (success: string | boolean | null) => void;
	submitText?: string | null;
}

export function Form({
	children,
	className = '',
	onSubmit,
	isLoading: isLoadingProp,
	defaultIsLoading = false,
	onLoadingChange,
	error: errorProp,
	defaultError = null,
	onErrorChange,
	success: successProp,
	defaultSuccess = null,
	onSuccessChange,
	submitText = 'Submit',
	...rest
}: FormProps) {
	const [isLoading, setIsLoading] = useControllableState({
		value: isLoadingProp,
		defaultValue: defaultIsLoading,
		onChange: onLoadingChange,
	});

	const [error, setError] = useControllableState<string | null>({
		value: errorProp,
		defaultValue: defaultError,
		onChange: onErrorChange,
	});

	const [success, setSuccess] = useControllableState<string | boolean | null>({
		value: successProp,
		defaultValue: defaultSuccess,
		onChange: onSuccessChange,
	});

	function getButtonState() {
		if (isLoading) {
			return 'loading';
		}
		else if (error) {
			return 'error';
		}
		else if (success) {
			return 'success';
		}
		else {
			return null;
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (onSubmit) {
			try {
				setIsLoading(true);
				if (errorProp === undefined) {
					setError(null);
				}

				if (successProp === undefined) {
					setSuccess(null);
				}

				await onSubmit(e);

				if (successProp === undefined) {
					setSuccess(true);
				}
			}
			catch (err) {
				console.error(err);

				if (errorProp === undefined) {
					setError('An unexpected error occurred. Please try again.');
				}
			}
			finally {
				setIsLoading(false);
			}
		}
	};

	const animation = animate({ fadeIn: true, zoomIn: true, duration: 'short' });

	return (
		<form
			className={cn(
				'space-y-6',
				animate({ fadeIn: true, duration: 'medium' }),
				className
			)}
			onSubmit={handleSubmit}
			{...rest}
		>
			<div className="space-y-4">{children}</div>

			{error && (
				<div className={animation}>
					<Alert
						color="danger"
						title={error}
					/>
				</div>
			)}

			{typeof success === 'string' && !error && (
				<div className={animation}>
					<Alert
						color="success"
						title={success}
					/>
				</div>
			)}

			{submitText && !error && (
				<div>
					<TriStateButton
						state={getButtonState()}
						className="w-full justify-center"
						type="submit"
					>
						{submitText}
					</TriStateButton>
				</div>
			)}
		</form>
	);
}
