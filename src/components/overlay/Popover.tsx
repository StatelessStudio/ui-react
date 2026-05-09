'use client';

import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn, styles, StyleProps } from '@/style-engine';
import { useControllableState } from '@/hooks';
import { useOverlayPosition } from './useOverlayPosition';
import { useOverlay } from './useOverlay';

const popoverStyles = styles({
	base:
		'fixed z-50 p-4 bg-background border border-muted/50 ' +
		'rounded-md shadow-md min-w-48 text-sm',
	variants: {
		position: {
			top: 'origin-bottom',
			bottom: 'origin-top',
			left: 'origin-right',
			right: 'origin-left',
		},
	},
	defaults: {
		position: 'bottom',
	},
});

type PopoverStyleProps = StyleProps<typeof popoverStyles>;

export interface PopoverProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, keyof PopoverStyleProps>,
		PopoverStyleProps {
	trigger: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function Popover({
	trigger,
	position = popoverStyles.defaults.position,
	open,
	defaultOpen = false,
	onOpenChange,
	className = '',
	children,
	...props
}: PopoverProps) {
	const [isOpen, setIsOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const triggerRef = useRef<HTMLDivElement>(null);

	const { mounted, overlayRef: popoverRef } = useOverlay({
		isOpen: !!isOpen,
		onClose: () => setIsOpen(false),
		lockBodyScroll: false,
	});

	const { position: coords, mounted: positionMounted } = useOverlayPosition({
		isOpen: !!isOpen,
		overlayRef: popoverRef,
		anchorRef: triggerRef,
		placement: position,
	});

	useEffect(() => {
		function handleOutside(event: PointerEvent) {
			if (
				triggerRef.current &&
				triggerRef.current.contains(event.target as Node)
			) {
				return;
			}
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener('pointerdown', handleOutside);
		}
		return () => {
			document.removeEventListener('pointerdown', handleOutside);
		};
	}, [isOpen, popoverRef, triggerRef, setIsOpen]);

	const togglePopover = () => setIsOpen((prev) => !prev);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			togglePopover();
		}
	};

	return (
		<div
			className={cn('relative inline-block', className)}
			ref={(node) => {
				(triggerRef as React.RefObject<HTMLDivElement | null>).current = node;
				const propRef = (props as React.RefAttributes<HTMLDivElement>).ref;
				if (typeof propRef === 'function') {
					propRef(node);
				}
				else if (propRef) {
					(propRef as React.RefObject<HTMLDivElement | null>).current = node;
				}
			}}
			{...props}
		>
			<div
				onClick={togglePopover}
				onKeyDown={handleKeyDown}
				className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md inline-block"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				tabIndex={0}
				role="button"
			>
				{trigger}
			</div>

			{isOpen &&
				mounted &&
				positionMounted &&
				createPortal(
					<div
						ref={popoverRef}
						{...popoverStyles.render({ position, className })}
						style={{ top: coords.y, left: coords.x }}
						role="dialog"
					>
						{children}
					</div>,
					document.body
				)}
		</div>
	);
}
