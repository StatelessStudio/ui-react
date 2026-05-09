'use client';

import React from 'react';
import { styles, StyleProps } from '@/style-engine';
import { Collapsible } from './Collapsible';
import { useControllableState } from '@/hooks';

const accordionStyles = styles({
	base: 'flex flex-col space-y-2',
});

export interface AccordionItemData {
	id: string;
	title: React.ReactNode;
	content: React.ReactNode;
	disabled?: boolean;
}

export type AccordionSingleProps = {
	type?: 'single';
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};

export type AccordionMultipleProps = {
	type: 'multiple';
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
};

type AccordionVariantProps = StyleProps<typeof accordionStyles>;

export type AccordionProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	'onChange' | keyof AccordionVariantProps
> &
	AccordionVariantProps & {
		items: AccordionItemData[];
	} & (AccordionSingleProps | AccordionMultipleProps);

export function Accordion({
	items,
	type = 'single',
	className = '',
	value,
	defaultValue,
	onValueChange,
	...htmlProps
}: AccordionProps) {
	// Use a generic union type to handle both string and string[] states
	const [currentValue, setCurrentValue] = useControllableState<
		string | string[]
	>({
		value: value as string | string[] | undefined,
		defaultValue:
			(defaultValue as string | string[] | undefined) ??
			(type === 'multiple' ? [] : ''),
		onChange: onValueChange as ((val: string | string[]) => void) | undefined,
	});

	const handleItemChange = (itemId: string, isOpen: boolean) => {
		if (type === 'single') {
			const newValue = isOpen ? itemId : '';
			setCurrentValue(newValue);
		}
		else {
			const currentArray = Array.isArray(currentValue) ? currentValue : [];
			if (isOpen) {
				setCurrentValue([...currentArray, itemId]);
			}
			else {
				setCurrentValue(currentArray.filter((id) => id !== itemId));
			}
		}
	};

	const isItemOpen = (itemId: string) => {
		if (type === 'single') {
			return currentValue === itemId;
		}
		return Array.isArray(currentValue) && currentValue.includes(itemId);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
			return;
		}

		const container = e.currentTarget;
		const buttons = Array.from(
			container.querySelectorAll('button[aria-controls]:not([disabled])')
		) as HTMLButtonElement[];
		const focusedElement = document.activeElement as HTMLButtonElement;
		const currentIndex = buttons.indexOf(focusedElement);

		if (currentIndex === -1) {
			return;
		}

		e.preventDefault();

		let nextIndex = currentIndex;
		if (e.key === 'ArrowDown') {
			nextIndex = (currentIndex + 1) % buttons.length;
		}
		else if (e.key === 'ArrowUp') {
			nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
		}
		else if (e.key === 'Home') {
			nextIndex = 0;
		}
		else if (e.key === 'End') {
			nextIndex = buttons.length - 1;
		}

		buttons[nextIndex]?.focus();
	};

	return (
		<div
			{...accordionStyles.render({ className })}
			onKeyDown={(e) => {
				handleKeyDown(e);
				htmlProps.onKeyDown?.(e);
			}}
			{...htmlProps}
		>
			{items.map((item) => (
				<Collapsible
					key={item.id}
					title={item.title}
					disabled={item.disabled}
					open={isItemOpen(item.id)}
					onOpenChange={(isOpen) => handleItemChange(item.id, isOpen)}
				>
					{item.content}
				</Collapsible>
			))}
		</div>
	);
}
