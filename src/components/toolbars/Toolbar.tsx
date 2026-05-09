import {
	KeyboardEvent,
	HTMLAttributes,
	FocusEvent,
	useEffect,
	useRef,
} from 'react';
import { styles } from '@/style-engine';

const toolbarWrapperStyles = styles({
	base:
		'flex gap-1 p-1 rounded-md bg-slate-100 dark:bg-slate-800 ' +
		'border border-slate-200 dark:border-slate-700',
	variants: {
		orientation: {
			horizontal: 'flex-row items-center w-fit',
			vertical: 'flex-col min-w-fit w-min',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

const focusableSelectors = [
	'button:not([disabled])',
	'[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical';
}

export function Toolbar({
	orientation = toolbarWrapperStyles.defaults.orientation,
	className = '',
	...props
}: ToolbarProps) {
	const toolbarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!toolbarRef.current) {
			return;
		}

		const items = Array.from(
			toolbarRef.current.querySelectorAll(focusableSelectors)
		) as HTMLElement[];

		items.forEach((item, i) => {
			item.setAttribute('tabindex', i === 0 ? '0' : '-1');
		});
	}, []);

	const handleFocusIn = (e: FocusEvent<HTMLDivElement>) => {
		if (props.onFocus) {
			props.onFocus(e);
		}

		const items = Array.from(
			e.currentTarget.querySelectorAll(focusableSelectors)
		) as HTMLElement[];

		if (items.includes(e.target as HTMLElement)) {
			items.forEach((item) => {
				item.setAttribute('tabindex', item === e.target ? '0' : '-1');
			});
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (props.onKeyDown) {
			props.onKeyDown(e);
		}

		const targetName = (e.target as HTMLElement).tagName;
		if (['INPUT', 'SELECT', 'TEXTAREA'].includes(targetName)) {
			return;
		}

		const isHorizontal = orientation === 'horizontal';
		const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
		const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

		const isNavKey = [nextKey, prevKey, 'Home', 'End'].includes(e.key);
		if (!isNavKey) {
			return;
		}

		const container = e.currentTarget;
		const items = Array.from(
			container.querySelectorAll(focusableSelectors)
		) as HTMLElement[];

		const index = items.indexOf(document.activeElement as HTMLElement);
		if (index === -1) {
			return;
		}

		e.preventDefault();

		let nextIndex = index;
		if (e.key === nextKey) {
			nextIndex = index + 1 >= items.length ? 0 : index + 1;
		}
		else if (e.key === prevKey) {
			nextIndex = index - 1 < 0 ? items.length - 1 : index - 1;
		}
		else if (e.key === 'Home') {
			nextIndex = 0;
		}
		else if (e.key === 'End') {
			nextIndex = items.length - 1;
		}

		items[nextIndex]?.focus();
	};

	return (
		<div
			ref={toolbarRef}
			role="toolbar"
			aria-orientation={orientation}
			{...toolbarWrapperStyles.render({
				orientation: orientation as 'horizontal' | 'vertical',
				className,
			})}
			onFocus={handleFocusIn}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
}
