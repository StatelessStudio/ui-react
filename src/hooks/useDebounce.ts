'use client';

import { useCallback, useEffect, useRef } from 'react';

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
	(...args: Parameters<T>): void;
	/**
	 * Cancel any pending debounced invocation
	 */
	cancel: () => void;
	/**
	 * Immediately invoke the callback with pending arguments, if any
	 */
	flush: () => void;
}

/**
 * A hook for debouncing callback functions with cancel and flush support.
 *
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds (default: 500ms).
 * 	Changes are reactive.
 * @returns A debounced version of the callback with cancel() and flush() methods
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce((query) => {
 *   fetch(`/api/search?q=${query}`);
 * }, 500);
 *
 * // Cancel pending search
 * debouncedSearch.cancel();
 *
 * // Execute immediately
 * debouncedSearch.flush();
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number = 500
): DebouncedFunction<T> {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);
	const delayRef = useRef(delay);
	const lastArgsRef = useRef<unknown[] | null>(null);

	// Update refs when callback or delay changes
	useEffect(() => {
		callbackRef.current = callback;
		delayRef.current = delay;
	}, [callback, delay]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const cancel = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		lastArgsRef.current = null;
	}, []);

	const flush = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;

			if (lastArgsRef.current) {
				callbackRef.current(...lastArgsRef.current);
				lastArgsRef.current = null;
			}
		}
	}, []);

	const debouncedCallback = useCallback(
		((...args: unknown[]) => {
			lastArgsRef.current = args;

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args);
				timeoutRef.current = null;
			}, delayRef.current);
		}) as T,
		[]
	);

	return Object.assign(debouncedCallback, {
		cancel,
		flush,
	}) as DebouncedFunction<T>;
}
