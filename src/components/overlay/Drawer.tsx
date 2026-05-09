'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { animate } from '@/animations';
import { styles } from '@/style-engine';
import { Heading, HeadingLevel } from '../typography';
import { useOverlay } from './useOverlay';

const drawerParentStyles = styles({
	base: 'fixed inset-0 z-50 flex',
	variants: {
		side: {
			left: 'justify-start',
			right: 'justify-end',
		},
	},
	defaults: {
		side: 'right',
	},
});

const drawerOverlayStyles = styles({
	base: [
		'fixed inset-0 bg-black/50',
		animate({ fadeIn: true, duration: 'long', easing: 'ease-out' }),
	],
});

const drawerContainerStyles = styles({
	base: [
		'relative bg-background shadow-xl w-full max-w-sm flex flex-col h-full',
		animate({ duration: 'long', fadeIn: true, easing: 'ease-out' }),
	],
	variants: {
		side: {
			left: 'slide-in-from-left',
			right: 'slide-in-from-right',
		},
	},
	defaults: {
		side: 'right',
	},
});

const drawerHeaderStyles = styles({
	base: 'p-6 pb-0 border-b border-muted',
});

const drawerContentStyles = styles({
	base: 'p-6 overflow-y-auto',
});

const drawerFooterStyles = styles({
	base: 'p-6 border-t border-muted flex gap-3 justify-end',
});

export interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
	onClose?: () => void;
}

export function DrawerOverlay({
	className = '',
	onClose,
	...props
}: DrawerOverlayProps) {
	return (
		<div
			{...drawerOverlayStyles.render({ className })}
			onClick={onClose}
			aria-hidden="true"
			{...props}
		/>
	);
}

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	side?: 'left' | 'right';
}

export function Drawer({
	isOpen,
	onClose,
	children,
	className = '',
	side = drawerContainerStyles.defaults.side,
	...props
}: DrawerProps) {
	const { mounted, overlayRef } = useOverlay({ isOpen, onClose });

	if (!mounted || !isOpen || typeof document === 'undefined') {
		return null;
	}

	return createPortal(
		<div {...drawerParentStyles.render({ side })}>
			<DrawerOverlay onClose={onClose} />
			<div
				ref={overlayRef}
				{...drawerContainerStyles.render({
					side: side as 'left' | 'right',
					className,
				})}
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

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function DrawerHeader({ className = '', ...props }: DrawerHeaderProps) {
	return (
		<div
			{...props}
			{...drawerHeaderStyles.render({ className })}
		/>
	);
}

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: HeadingLevel;
}

export function DrawerTitle({ level = 2, ...props }: DrawerTitleProps) {
	return (
		<Heading
			level={level}
			{...props}
		/>
	);
}

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement>;

export function DrawerContent({
	className = '',
	...props
}: DrawerContentProps) {
	return (
		<div
			{...drawerContentStyles.render({ className })}
			{...props}
		/>
	);
}

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function DrawerFooter({ className = '', ...props }: DrawerFooterProps) {
	return (
		<div
			{...drawerFooterStyles.render({ className })}
			{...props}
		/>
	);
}
