import React from 'react';
import { styles } from '@/style-engine';

const sidebarStyles = styles({
	base: 'w-64 flex h-full flex-col shrink-0 bg-background border-r border-muted',
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
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

export function Sidebar({ children, className = '', ...props }: SidebarProps) {
	return (
		<aside
			aria-label="Sidebar"
			{...sidebarStyles.render({ className })}
			{...props}
		>
			{children}
		</aside>
	);
}

export function SidebarHeader({
	className = '',
	...props
}: SidebarSectionProps) {
	return (
		<div
			{...sidebarHeaderStyles.render({ className })}
			{...props}
		/>
	);
}

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
