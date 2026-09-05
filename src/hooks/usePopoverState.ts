import { useState, useCallback } from 'react';

export interface PopoverState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

/**
 * Hook for managing popover open/close state with imperative control
 * @example
 * const popover = usePopoverState();
 *
 * <Popover open={popover.isOpen} onOpenChange={popover.setIsOpen}>
 *   Content
 * </Popover>
 *
 * // Then call imperatively:
 * popover.open();
 * popover.close();
 */
export function usePopoverState(defaultOpen = false): PopoverState {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	return { isOpen, open, close, toggle };
}
