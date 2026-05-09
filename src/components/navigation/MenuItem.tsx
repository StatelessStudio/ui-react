import React, { ReactNode } from 'react';
import { StyleProps, PolymorphicProps } from '@/style-engine';
import { navItemStyles } from './styles';

const menuItemStyles = navItemStyles;

type MenuItemStyleProps = StyleProps<typeof menuItemStyles>;

export interface MenuItemOwnProps extends Omit<MenuItemStyleProps, 'state'> {
	children: ReactNode | ReactNode[];
	active?: boolean;
	activeAria?: 'pressed' | 'selected' | 'page' | 'none';
	role?: string;
	tabIndex?: number;
}

export type MenuItemProps<E extends React.ElementType> = PolymorphicProps<
	E,
	MenuItemOwnProps
>;

export function MenuItem<E extends React.ElementType = 'button'>({
	as,
	children,
	active = false,
	color = 'primary',
	className = '',
	activeAria = 'page',
	role = 'menuitem',
	tabIndex,
	...props
}: MenuItemProps<E>) {
	const Component = as ?? 'button';
	const isButtonElement = Component === 'button';

	let ariaProps: Record<string, boolean | number | string> = {};

	if (active && activeAria !== 'none') {
		if (activeAria === 'pressed') {
			ariaProps['aria-pressed'] = true;
		}
		else if (activeAria === 'selected') {
			ariaProps['aria-selected'] = true;
		}
		else {
			ariaProps['aria-current'] = activeAria;
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isButtonElement && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			props['onClick' as keyof typeof props]?.(e);
		}
		props['onKeyDown' as keyof typeof props]?.(e);
	};

	return (
		<Component
			type={isButtonElement ? 'button' : undefined}
			role={role}
			tabIndex={tabIndex ?? (!isButtonElement ? 0 : undefined)}
			onKeyDown={handleKeyDown}
			{...ariaProps}
			{...props}
			{...menuItemStyles.render({
				color,
				state: active ? 'active' : 'inactive',
				className,
			})}
		>
			{children}
		</Component>
	);
}
