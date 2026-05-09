'use client';

import { useEffect, useState, useRef } from 'react';

export interface UseOverlayOptions {
	isOpen: boolean;
	onClose: () => void;
	lockBodyScroll?: boolean;
}

const FOCUSABLE_ELEMENTS_SELECTORS = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'textarea:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

// Global counter prevents scroll lock bugs when multiple modals are stacked
let scrollLockCount = 0;

export function useOverlay({
	isOpen,
	onClose,
	lockBodyScroll = true,
}: UseOverlayOptions) {
	const [mounted, setMounted] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	const savedOnClose = useRef(onClose);
	useEffect(() => {
		savedOnClose.current = onClose;
	}, [onClose]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		// Save the previous active element to restore focus when overlay closes
		previousFocusRef.current = document.activeElement as HTMLElement | null;

		if (lockBodyScroll) {
			scrollLockCount += 1;
			document.body.style.overflow = 'hidden';
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				savedOnClose.current();
			}
			else if (e.key === 'Tab' && overlayRef.current) {
				const focusableElements = Array.from(
					overlayRef.current.querySelectorAll<HTMLElement>(
						FOCUSABLE_ELEMENTS_SELECTORS
					)
				);

				if (focusableElements.length === 0) {
					e.preventDefault();
					return;
				}

				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				// If focus leaves the overlay
				// 	(e.g., clicking browser address bar and tabbing back)
				if (!overlayRef.current.contains(document.activeElement)) {
					e.preventDefault();
					(e.shiftKey ? lastElement : firstElement).focus();
					return;
				}

				// Standard bounded tab trap
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				}
				else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		const focusListener = requestAnimationFrame(() => {
			if (overlayRef.current) {
				const focusableElements =
					overlayRef.current.querySelectorAll<HTMLElement>(
						FOCUSABLE_ELEMENTS_SELECTORS
					);
				if (focusableElements.length > 0) {
					focusableElements[0].focus();
				}
				else {
					overlayRef.current.focus();
				}
			}
		});

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			cancelAnimationFrame(focusListener);

			if (lockBodyScroll) {
				scrollLockCount -= 1;
				if (scrollLockCount === 0) {
					document.body.style.overflow = '';
				}
			}

			// Restore focus to the element that originally triggered the overlay
			if (
				previousFocusRef.current &&
				document.body.contains(previousFocusRef.current)
			) {
				previousFocusRef.current.focus();
			}
		};
	}, [isOpen, lockBodyScroll]);

	return { mounted, overlayRef };
}
