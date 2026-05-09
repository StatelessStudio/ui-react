'use client';

import { styles, StyleProps } from '@/style-engine';
import { SearchIcon } from '@/icons';
import { Input } from './Input';
import type { InputProps } from './Input';

const searchStyles = styles({
	base: 'relative w-full inline-flex items-center',
	variants: {
		size: {
			sm: 'gap-2',
			md: 'gap-2',
			lg: 'gap-3',
		},
	},
	defaults: {
		size: 'md',
	},
});

type SearchStyleProps = StyleProps<typeof searchStyles>;

const searchIconStyles = styles({
	base: 'absolute left-3 h-4 w-4 text-muted pointer-events-none',
});

const searchInputStyles = styles({
	base: 'pl-10 min-w-0',
});

export type SearchProps = Omit<InputProps, 'type'> & SearchStyleProps;

export function Search({
	size = searchStyles.defaults.size,
	className = '',
	...props
}: SearchProps) {
	return (
		<div {...searchStyles.render({ size, className })}>
			<SearchIcon
				{...searchIconStyles.render()}
				aria-hidden="true"
			/>

			<Input
				type="search"
				size={size}
				{...searchInputStyles.render()}
				{...props}
			/>
		</div>
	);
}
