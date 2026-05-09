'use client';

import { useState, useEffect, useLayoutEffect, RefObject } from 'react';

const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface UseOverlayPositionOptions {
	isOpen: boolean;
	overlayRef: RefObject<HTMLElement | null>;
	anchorRef?: RefObject<HTMLElement | null>;
	placement?: Placement;
	offset?: number;
	initialPosition?: { x: number; y: number };
}

export function useOverlayPosition({
	isOpen,
	overlayRef,
	anchorRef,
	placement = 'bottom',
	offset = 8,
	initialPosition,
}: UseOverlayPositionOptions) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (!isOpen || !overlayRef.current || !mounted) {
			return;
		}

		const overlayRect = overlayRef.current.getBoundingClientRect();
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		let targetX = position.x;
		let targetY = position.y;

		if (initialPosition) {
			targetX = initialPosition.x;
			targetY = initialPosition.y;
		}
		else if (anchorRef?.current) {
			const anchorRect = anchorRef.current.getBoundingClientRect();

			switch (placement) {
				case 'top':
					targetX =
						anchorRect.left + anchorRect.width / 2 - overlayRect.width / 2;
					targetY = anchorRect.top - overlayRect.height - offset;
					break;
				case 'bottom':
					targetX =
						anchorRect.left + anchorRect.width / 2 - overlayRect.width / 2;
					targetY = anchorRect.bottom + offset;
					break;
				case 'left':
					targetX = anchorRect.left - overlayRect.width - offset;
					targetY =
						anchorRect.top + anchorRect.height / 2 - overlayRect.height / 2;
					break;
				case 'right':
					targetX = anchorRect.right + offset;
					targetY =
						anchorRect.top + anchorRect.height / 2 - overlayRect.height / 2;
					break;
			}
		}

		// Apply bounding box constraints
		if (targetX + overlayRect.width > windowWidth - offset) {
			targetX = windowWidth - overlayRect.width - offset;
		}

		if (targetX < offset) {
			targetX = offset;
		}

		if (targetY + overlayRect.height > windowHeight - offset) {
			targetY = windowHeight - overlayRect.height - offset;
		}
		if (targetY < offset) {
			targetY = offset;
		}

		if (targetX !== position.x || targetY !== position.y) {
			setPosition({ x: targetX, y: targetY });
		}
	}, [
		isOpen,
		mounted,
		placement,
		offset,
		initialPosition?.x,
		initialPosition?.y,
		// Add these dependencies to recalculate when they reference new DOM elements
		anchorRef,
		overlayRef,
	]);

	return { position, mounted };
}
