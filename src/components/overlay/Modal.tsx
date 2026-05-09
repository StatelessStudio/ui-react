'use client';

import React from 'react';
import { animate } from '@/animations';
import { styles } from '@/style-engine';
import { createPortal } from 'react-dom';
import { Heading, HeadingLevel } from '../typography';
import { useOverlay } from './useOverlay';

const modalBackdropStyles = styles({
	base: [
		'fixed inset-0 bg-black/50',
		animate({ fadeIn: true, duration: 'medium', easing: 'ease-out' }),
	],
});

const modalContainerStyles = styles({
	base: [
		'relative bg-background rounded-lg shadow-xl ' +
			'w-full max-w-md max-h-[90vh] flex flex-col',
		animate({ zoomIn: true, duration: 'medium', easing: 'ease-out' }),
	],
});

const modalHeaderStyles = styles({
	base: 'p-6 border-b border-muted/10',
});

const modalContentStyles = styles({
	base: 'p-6 overflow-y-auto',
});

const modalFooterStyles = styles({
	base: 'p-6 border-t border-muted/10 flex justify-end gap-3',
});

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export function Modal({
	isOpen,
	onClose,
	children,
	className = '',
	...props
}: ModalProps) {
	const { mounted, overlayRef } = useOverlay({ isOpen, onClose });

	// Use document.body carefully in SSR environments
	if (!mounted || !isOpen || typeof document === 'undefined') {
		return null;
	}

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				{...modalBackdropStyles.render({})}
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				ref={overlayRef}
				{...modalContainerStyles.render({ className })}
				role="dialog"
				aria-modal="true"
				tabIndex={-1}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body
	);
}

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalHeader({ className = '', ...props }: ModalHeaderProps) {
	return (
		<div
			{...modalHeaderStyles.render({ className })}
			{...props}
		/>
	);
}

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: HeadingLevel;
}

export function ModalTitle({ level = 2, ...props }: ModalTitleProps) {
	return (
		<Heading
			level={level}
			{...props}
		/>
	);
}

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalContent({ className = '', ...props }: ModalContentProps) {
	return (
		<div
			{...modalContentStyles.render({ className })}
			{...props}
		/>
	);
}

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalFooter({ className = '', ...props }: ModalFooterProps) {
	return (
		<div
			{...modalFooterStyles.render({ className })}
			{...props}
		/>
	);
}
