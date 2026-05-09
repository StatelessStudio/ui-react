'use client';

import React from 'react';
import { styles, StyleProps } from '@/style-engine';
import { ChevronRightIcon } from '@/icons';
import { useControllableState } from '@/hooks';
import { animate } from '@/animations';
import { navItemStyles } from './styles';

type TreeItemStyleProps = StyleProps<typeof navItemStyles>;

const treeItemContainerStyles = styles({
	base:
		'rounded-sm select-none outline-none ' +
		'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
	variants: {},
	defaults: {},
});

const treeItemButtonStyles = navItemStyles;

const treeItemNestedListStyles = styles({
	base:
		'pl-6 mt-1 flex flex-col space-y-1 relative ' +
		'before:absolute before:left-3 before:top-2 before:bottom-0 ' +
		'before:w-px before:bg-border',
	variants: {},
	defaults: {},
});

const treeItemIconStyles = styles({
	base: animate({ transitionTransform: true }),
	variants: {
		expanded: {
			true: 'rotate-90',
			false: '',
		},
	},
	defaults: {
		expanded: false,
	},
});

export interface TreeItemProps
	extends
		Omit<React.HTMLAttributes<HTMLLIElement>, keyof TreeItemStyleProps>,
		Omit<TreeItemStyleProps, 'state'> {
	label: React.ReactNode;
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	isActive?: boolean;
	icon?: React.ReactNode;
}

export function TreeItem({
	label,
	expanded,
	defaultExpanded = false,
	onExpandedChange,
	isActive = false,
	icon,
	color = 'primary',
	size,
	className = '',
	children,
	...props
}: TreeItemProps) {
	const hasChildren = React.Children.count(children) > 0;
	const [isExpanded, setIsExpanded] = useControllableState({
		value: expanded,
		defaultValue: defaultExpanded,
		onChange: onExpandedChange,
	});

	const toggleExpanded = (e: React.SyntheticEvent) => {
		e.stopPropagation();
		if (hasChildren) {
			setIsExpanded(!isExpanded);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleExpanded(e);

			if (props.onClick) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				props.onClick(e as any);
			}
		}
		if (props.onKeyDown) {
			props.onKeyDown(e);
		}
	};

	const { onClick, ...liProps } = props;

	return (
		<li
			role="treeitem"
			aria-expanded={hasChildren ? isExpanded : undefined}
			aria-selected={isActive}
			{...treeItemContainerStyles.render({ className })}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			{...liProps}
		>
			<div
				{...treeItemButtonStyles.render({
					state: isActive ? 'active' : 'inactive',
					color,
					size,
				})}
				onClick={(e) => {
					toggleExpanded(e);

					if (onClick) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						onClick(e as any);
					}
				}}
			>
				<span className="flex items-center justify-center w-4 h-4 mr-1">
					{hasChildren && (
						<ChevronRightIcon
							{...treeItemIconStyles.render({
								expanded: isExpanded ? 'true' : 'false',
							})}
							width="14"
							height="14"
						/>
					)}
				</span>

				{icon && <span className="mr-2 flex-shrink-0">{icon}</span>}

				<span className="truncate">{label}</span>
			</div>

			{hasChildren && isExpanded && (
				<ul
					role="group"
					{...treeItemNestedListStyles.render({})}
				>
					{children}
				</ul>
			)}
		</li>
	);
}
