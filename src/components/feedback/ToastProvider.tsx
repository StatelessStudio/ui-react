'use client';

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { styles, StyleProps } from '@/style-engine';
import { Toast, ToastProps } from './Toast';

const toastContainerPositionStyles = styles({
	base: 'fixed z-50 flex flex-col gap-2 pointer-events-none',
	variants: {
		position: {
			'top-right': 'top-4 right-4 items-end',
			'top-left': 'top-4 left-4 items-start',
			'bottom-right': 'bottom-4 right-4 items-end',
			'bottom-left': 'bottom-4 left-4 items-start',
			'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
			'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
		},
	},
	defaults: {
		position: 'bottom-right',
	},
});

export interface ToastOptions extends Omit<ToastProps, 'id' | 'onClose'> {
	/**
	 * Duration in milliseconds before the toast auto-dismisses.
	 * Set to 0 to disable auto-dismissal.
	 * @default 5000
	 */
	duration?: number;
}

export interface ToastState extends ToastOptions {
	id: string;
}

export interface ToastContextType {
	toasts: ToastState[];
	/**
	 * Display a new toast notification.
	 * @returns The generated ID of the toast
	 */
	toast: (options: ToastOptions) => string;
	/**
	 * Remove a specific toast by its ID.
	 */
	removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
	undefined
);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

type ToastProviderStyleProps = StyleProps<typeof toastContainerPositionStyles>;

export interface ToastProviderProps extends Omit<
	ToastProviderStyleProps,
	'position'
> {
	children: React.ReactNode;
	/**
	 * Position of the toast container on the screen.
	 * @default "bottom-right"
	 */
	position?:
		| 'top-right'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-left'
		| 'top-center'
		| 'bottom-center';
}

function generateToastId() {
	if (
		typeof globalThis !== 'undefined' &&
		globalThis.crypto &&
		typeof globalThis.crypto.randomUUID === 'function'
	) {
		return globalThis.crypto.randomUUID();
	}

	return Math.random().toString(36).substring(2, 11);
}

export function ToastProvider({
	children,
	position = 'bottom-right',
}: ToastProviderProps) {
	const [toasts, setToasts] = useState<ToastState[]>([]);
	const timeoutIds = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map()
	);

	const removeToast = useCallback((id: string) => {
		const timeoutId = timeoutIds.current.get(id);

		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutIds.current.delete(id);
		}

		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toast = useCallback((options: ToastOptions) => {
		const id = generateToastId();
		const duration = options.duration ?? 5000;

		setToasts((prev) => [...prev, { ...options, duration, id }]);

		return id;
	}, []);

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		return () => {
			timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
			timeoutIds.current.clear();
		};
	}, []);

	const toastContainer = (
		<div
			{...toastContainerPositionStyles.render({
				position,
			})}
		>
			{toasts.map((t) => (
				<Toast
					key={t.id}
					{...t}
					onClose={() => removeToast(t.id)}
				/>
			))}
		</div>
	);

	return (
		<ToastContext.Provider value={{ toasts, toast, removeToast }}>
			{children}
			{mounted && typeof document !== 'undefined'
				? createPortal(toastContainer, document.body)
				: null}
		</ToastContext.Provider>
	);
}
