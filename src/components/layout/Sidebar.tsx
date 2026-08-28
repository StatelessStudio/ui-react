'use client';

import React, { useState } from 'react';
import { styles } from '@/style-engine';
import { ChevronLeftIcon } from '@/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/icons/ChevronRightIcon';

const sidebarStyles = styles({
	base: 'w-64 flex h-full flex-col shrink-0 bg-background border-r border-muted transition-all duration-300 ease-in-out',
	variants: {
		isCollapsed: {
			true: 'w-16',
			false: 'w-64',
		},
	},
	defaults: { isCollapsed: false },
});

const sidebarHeaderStyles = styles({
	base: 'p-6 flex items-center justify-between transition-all duration-300 ease-in-out',
	variants: {
		isCollapsed: {
			true: 'px-2',
			false: 'p-6',
		},
	},
	defaults: { isCollapsed: false },
});

const sidebarContentStyles = styles({
	base: 'flex-1 min-h-0 space-y-1 px-3 overflow-y-auto transition-all duration-300 ease-in-out',
	variants: {
		isCollapsed: {
			true: 'px-2',
			false: 'px-3',
		},
	},
	defaults: { isCollapsed: false },
});

const sidebarFooterStyles = styles({
	base: 'p-4 transition-all duration-300 ease-in-out',
	variants: {
		isCollapsed: {
			true: 'px-2',
			false: 'p-4',
		},
	},
	defaults: { isCollapsed: false },
});

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
	className?: string;
	children?: React.ReactNode;
	defaultCollapsed?: boolean;
	onCollapseChange?: (collapsed: boolean) => void;
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
	isCollapsed?: boolean;
	className?: string;
	children?: React.ReactNode;
}

interface SidebarHeaderInternalProps extends React.HTMLAttributes<HTMLDivElement> {
	onToggleCollapse?: () => void;
	isCollapsed?: boolean;
	children?: React.ReactNode;
}

export function Sidebar({
	children,
	className = '',
	defaultCollapsed = false,
	onCollapseChange,
	...props
}: SidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	const handleToggleCollapse = () => {
		const newState = !isCollapsed;
		setIsCollapsed(newState);
		if (onCollapseChange) {
			onCollapseChange(newState);
		}
	};

	return (
		<aside
			aria-label="Sidebar"
			{...sidebarStyles.render({ className, isCollapsed })}
			{...props}
		>
			<SidebarHeader
				onToggleCollapse={handleToggleCollapse}
				isCollapsed={isCollapsed}
			>
				{children}
			</SidebarHeader>
			<SidebarContent isCollapsed={isCollapsed}>{children}</SidebarContent>
			<SidebarFooter isCollapsed={isCollapsed}>{children}</SidebarFooter>
		</aside>
	);
}

export function SidebarHeader({
	onToggleCollapse,
	isCollapsed = false,
	className = '',
	...props
}: SidebarHeaderInternalProps) {
	return (
		<div
			{...sidebarHeaderStyles.render({ className, isCollapsed })}
			{...props}
		>
			{props.children && !isCollapsed ? props.children : null}
			{onToggleCollapse !== undefined && (
				<button
					type="button"
					onClick={onToggleCollapse}
					className="flex items-center justify-center w-8 h-8 rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ml-auto"
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{isCollapsed ? (
						<ChevronRightIcon className="h-5 w-5" />
					) : (
						<ChevronLeftIcon className="h-5 w-5" />
					)}
				</button>
			)}
		</div>
	);
}

export function SidebarContent({
	isCollapsed = false,
	className = '',
	...props
}: SidebarSectionProps) {
	return (
		<div
			{...sidebarContentStyles.render({ className, isCollapsed })}
			{...props}
		/>
	);
}

export function SidebarFooter({
	isCollapsed = false,
	className = '',
	...props
}: SidebarSectionProps) {
	return (
		<div
			{...sidebarFooterStyles.render({ className, isCollapsed })}
			{...props}
		/>
	);
}
