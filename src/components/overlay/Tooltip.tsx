'use client';

import React, { useRef, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn, styles, StyleProps } from '@/style-engine';
import { useControllableState } from '@/hooks';
import { useOverlayPosition } from './useOverlayPosition';

const tooltipStyles = styles({
	base:
		'fixed z-50 px-2.5 py-1.5 text-xs font-medium ' +
		'text-white bg-slate-800 rounded shadow-md ' +
		'whitespace-nowrap pointer-events-none',
	variants: {
		position: {
			top: 'mb-0',
			bottom: 'mt-0',
			left: 'mr-0',
			right: 'ml-0',
		},
	},
	defaults: {
		position: 'top',
	},
});

type TooltipStyleProps = StyleProps<typeof tooltipStyles>;

export interface TooltipProps
	extends
		Omit<
			React.HTMLAttributes<HTMLDivElement>,
			'content' | keyof TooltipStyleProps
		>,
		TooltipStyleProps {
	content: React.ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
	content,
	position = tooltipStyles.defaults.position,
	open,
	defaultOpen = false,
	onOpenChange,
	className = '',
	children,
	...props
}: TooltipProps) {
	const [isVisible, setIsVisible] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const id = React.useId();
	const triggerRef = useRef<HTMLElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const { position: coords, mounted } = useOverlayPosition({
		isOpen: isVisible,
		overlayRef: tooltipRef,
		anchorRef: triggerRef,
		placement: position,
	});

	if (!React.isValidElement(children)) {
		return <>{children}</>;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const child = children as React.ReactElement<any> & { ref?: React.Ref<any> };

	const handleMouseEnter = (e: React.MouseEvent) => {
		setIsVisible(true);
		if (child.props.onMouseEnter) {
			child.props.onMouseEnter(e);
		}
	};

	const handleMouseLeave = (e: React.MouseEvent) => {
		setIsVisible(false);
		if (child.props.onMouseLeave) {
			child.props.onMouseLeave(e);
		}
	};

	const handleFocus = (e: React.FocusEvent) => {
		setIsVisible(true);
		if (child.props.onFocus) {
			child.props.onFocus(e);
		}
	};

	const handleBlur = (e: React.FocusEvent) => {
		setIsVisible(false);
		if (child.props.onBlur) {
			child.props.onBlur(e);
		}
	};

	let tooltipElement = null;

	if (isVisible && mounted) {
		tooltipElement = createPortal(
			<div
				id={id}
				ref={tooltipRef}
				role="tooltip"
				{...props}
				{...tooltipStyles.render({
					position: position as 'top' | 'bottom' | 'left' | 'right',
					className,
				})}
				style={{ left: coords.x, top: coords.y }}
			>
				{content}
			</div>,
			document.body
		);
	}

	const trigger = cloneElement(
		child,
		{
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onFocus: handleFocus,
			onBlur: handleBlur,
			'aria-describedby': isVisible ? id : undefined,
			ref: (node: HTMLElement) => {
				(triggerRef as React.RefObject<HTMLElement | null>).current = node;
				const existingRef = child.ref;

				if (typeof existingRef === 'function') {
					existingRef(node);
				}
				else if (existingRef) {
					existingRef.current = node;
				}
			},
			className: cn('relative inline-block', child.props.className),
		},
		child.props.children
	);

	return (
		<>
			{trigger}
			{tooltipElement}
		</>
	);
}
