import { HTMLAttributes, ReactNode } from 'react';
import { styles } from '@/style-engine';

const menuStyles = styles({
	base: 'flex flex-col gap-1 h-full overflow-auto',
});

export interface MenuProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode | ReactNode[];
}

export function Menu({
	children,
	className = '',
	role = 'menu',
	...props
}: MenuProps) {
	return (
		<nav
			role={role}
			{...menuStyles.render({ className })}
			{...props}
		>
			{children}
		</nav>
	);
}
