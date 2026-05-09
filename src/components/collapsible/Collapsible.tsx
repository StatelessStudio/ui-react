'use client';

import React, { useId } from 'react';
import { styles, StyleProps } from '@/style-engine';
import { ChevronDownIcon, ChevronUpIcon } from '@/icons';
import { useControllableState } from '@/hooks';

const collapsibleStyles = styles({
	base: 'rounded-md border border-border bg-card text-foreground shadow-sm',
});

const collapsibleButtonStyles = styles({
	base:
		'flex w-full items-center justify-between px-4 py-3 font-medium text-left ' +
		'transition-colors rounded-md ' +
		'focus-visible:outline-none focus-visible:ring-2 ' +
		'focus-visible:ring-ring focus-visible:ring-offset-2',
	variants: {
		disabled: {
			true: 'opacity-50 cursor-not-allowed',
			false: 'hover:bg-muted/50 cursor-pointer',
		},
		open: {
			true: 'rounded-b-none border-b border-border',
			false: '',
		},
	},
	defaults: {
		disabled: false,
		open: false,
	},
});

const collapsibleContentStyles = styles({
	base: 'px-4 py-3 animate-in slide-in-from-top-1 fade-in-0 duration-200 ease-out',
});

const chevronStyles = 'h-4 w-4 text-muted-foreground transition-transform';

type CollapsibleStyleProps = StyleProps<typeof collapsibleButtonStyles>;

export interface CollapsibleProps
	extends
		Omit<
			React.HTMLAttributes<HTMLDivElement>,
			'title' | keyof CollapsibleStyleProps
		>,
		Omit<CollapsibleStyleProps, 'open' | 'disabled'> {
	title: React.ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
}

export function Collapsible({
	title,
	defaultOpen = false,
	open,
	onOpenChange,
	disabled = false,
	className = '',
	children,
	...props
}: CollapsibleProps) {
	const contentId = useId();

	const [isOpen, setIsOpen] = useControllableState<boolean>({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});

	const toggleOpen = () => {
		if (disabled) {
			return;
		}
		setIsOpen(!isOpen);
	};

	return (
		<div
			{...collapsibleStyles.render({ className })}
			{...props}
		>
			<button
				type="button"
				disabled={disabled}
				{...collapsibleButtonStyles.render({
					disabled,
					open: isOpen,
				})}
				onClick={toggleOpen}
				aria-expanded={isOpen}
				aria-controls={contentId}
			>
				<span>{title}</span>
				{isOpen ? (
					<ChevronUpIcon className={chevronStyles} />
				) : (
					<ChevronDownIcon className={chevronStyles} />
				)}
			</button>
			{isOpen && (
				<div
					id={contentId}
					role="region"
					{...collapsibleContentStyles.render()}
				>
					{children}
				</div>
			)}
		</div>
	);
}
