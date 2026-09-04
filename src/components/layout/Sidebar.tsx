'use client';

import React from 'react';
import { styles } from '@/style-engine';

const sidebarStyles = styles({
	base:
		'flex h-full flex-col shrink-0 bg-background border-r border-muted ' +
		'transition-all duration-300 ease-in-out',
	variants: {
		expanded: {
			true: 'w-64',
			false: 'w-30',
		},
	},
	defaults: {
		expanded: true,
	},
});

const sidebarHeaderStyles = styles({
	base: 'p-6',
});

const sidebarContentStyles = styles({
	base: 'flex-1 min-h-0 space-y-1 px-3 overflow-y-auto',
});

const sidebarFooterStyles = styles({
	base: 'p-4',
});

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
	className?: string;
	children?: React.ReactNode;
	expanded?: boolean;
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

export function Sidebar({
	children,
	expanded = true,
	className = '',
	...props
}: SidebarProps) {
	return (
		<aside
			aria-label="Sidebar"
			{...sidebarStyles.render({ className, expanded })}
			{...props}
		>
			{children}
		</aside>
	);
}

/******************************************************************************
 * Sidebar Header component
 *****************************************************************************/

export interface SidebarHeaderProps extends SidebarSectionProps {
	actionMenu?: React.ReactNode;
}

export function SidebarHeader({
	className = '',
	actionMenu,
	...props
}: SidebarHeaderProps) {
	return (
		<div
			{...sidebarHeaderStyles.render({ className })}
			{...props}
		>
			{actionMenu && (
				<div className="absolute top-6 right-4 z-10">{actionMenu}</div>
			)}
			{props.children}
		</div>
	);
}

/******************************************************************************
 * Sidebar Content component
 *****************************************************************************/

export function SidebarContent({
	className = '',
	...props
}: SidebarSectionProps) {
	return (
		<div
			{...sidebarContentStyles.render({ className })}
			{...props}
		/>
	);
}

/******************************************************************************
 * Sidebar Footer component
 *****************************************************************************/

export function SidebarFooter({
	className = '',
	...props
}: SidebarSectionProps) {
	return (
		<div
			{...sidebarFooterStyles.render({ className })}
			{...props}
		/>
	);
}
