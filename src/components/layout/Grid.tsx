import React from 'react';
import { cn } from '@/style-engine';

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Responsive<T> = T | { [K in Breakpoint]?: T };

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

const colsMap: Record<Breakpoint, Record<GridCols, string>> = {
	base: {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6',
		7: 'grid-cols-7',
		8: 'grid-cols-8',
		9: 'grid-cols-9',
		10: 'grid-cols-10',
		11: 'grid-cols-11',
		12: 'grid-cols-12',
	},
	sm: {
		1: 'sm:grid-cols-1',
		2: 'sm:grid-cols-2',
		3: 'sm:grid-cols-3',
		4: 'sm:grid-cols-4',
		5: 'sm:grid-cols-5',
		6: 'sm:grid-cols-6',
		7: 'sm:grid-cols-7',
		8: 'sm:grid-cols-8',
		9: 'sm:grid-cols-9',
		10: 'sm:grid-cols-10',
		11: 'sm:grid-cols-11',
		12: 'sm:grid-cols-12',
	},
	md: {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
		5: 'md:grid-cols-5',
		6: 'md:grid-cols-6',
		7: 'md:grid-cols-7',
		8: 'md:grid-cols-8',
		9: 'md:grid-cols-9',
		10: 'md:grid-cols-10',
		11: 'md:grid-cols-11',
		12: 'md:grid-cols-12',
	},
	lg: {
		1: 'lg:grid-cols-1',
		2: 'lg:grid-cols-2',
		3: 'lg:grid-cols-3',
		4: 'lg:grid-cols-4',
		5: 'lg:grid-cols-5',
		6: 'lg:grid-cols-6',
		7: 'lg:grid-cols-7',
		8: 'lg:grid-cols-8',
		9: 'lg:grid-cols-9',
		10: 'lg:grid-cols-10',
		11: 'lg:grid-cols-11',
		12: 'lg:grid-cols-12',
	},
	xl: {
		1: 'xl:grid-cols-1',
		2: 'xl:grid-cols-2',
		3: 'xl:grid-cols-3',
		4: 'xl:grid-cols-4',
		5: 'xl:grid-cols-5',
		6: 'xl:grid-cols-6',
		7: 'xl:grid-cols-7',
		8: 'xl:grid-cols-8',
		9: 'xl:grid-cols-9',
		10: 'xl:grid-cols-10',
		11: 'xl:grid-cols-11',
		12: 'xl:grid-cols-12',
	},
	'2xl': {
		1: '2xl:grid-cols-1',
		2: '2xl:grid-cols-2',
		3: '2xl:grid-cols-3',
		4: '2xl:grid-cols-4',
		5: '2xl:grid-cols-5',
		6: '2xl:grid-cols-6',
		7: '2xl:grid-cols-7',
		8: '2xl:grid-cols-8',
		9: '2xl:grid-cols-9',
		10: '2xl:grid-cols-10',
		11: '2xl:grid-cols-11',
		12: '2xl:grid-cols-12',
	},
};

const gapMap: Record<Breakpoint, Record<GridGap, string>> = {
	base: {
		0: 'gap-0',
		1: 'gap-1',
		2: 'gap-2',
		3: 'gap-3',
		4: 'gap-4',
		5: 'gap-5',
		6: 'gap-6',
		8: 'gap-8',
		10: 'gap-10',
		12: 'gap-12',
		16: 'gap-16',
	},
	sm: {
		0: 'sm:gap-0',
		1: 'sm:gap-1',
		2: 'sm:gap-2',
		3: 'sm:gap-3',
		4: 'sm:gap-4',
		5: 'sm:gap-5',
		6: 'sm:gap-6',
		8: 'sm:gap-8',
		10: 'sm:gap-10',
		12: 'sm:gap-12',
		16: 'sm:gap-16',
	},
	md: {
		0: 'md:gap-0',
		1: 'md:gap-1',
		2: 'md:gap-2',
		3: 'md:gap-3',
		4: 'md:gap-4',
		5: 'md:gap-5',
		6: 'md:gap-6',
		8: 'md:gap-8',
		10: 'md:gap-10',
		12: 'md:gap-12',
		16: 'md:gap-16',
	},
	lg: {
		0: 'lg:gap-0',
		1: 'lg:gap-1',
		2: 'lg:gap-2',
		3: 'lg:gap-3',
		4: 'lg:gap-4',
		5: 'lg:gap-5',
		6: 'lg:gap-6',
		8: 'lg:gap-8',
		10: 'lg:gap-10',
		12: 'lg:gap-12',
		16: 'lg:gap-16',
	},
	xl: {
		0: 'xl:gap-0',
		1: 'xl:gap-1',
		2: 'xl:gap-2',
		3: 'xl:gap-3',
		4: 'xl:gap-4',
		5: 'xl:gap-5',
		6: 'xl:gap-6',
		8: 'xl:gap-8',
		10: 'xl:gap-10',
		12: 'xl:gap-12',
		16: 'xl:gap-16',
	},
	'2xl': {
		0: '2xl:gap-0',
		1: '2xl:gap-1',
		2: '2xl:gap-2',
		3: '2xl:gap-3',
		4: '2xl:gap-4',
		5: '2xl:gap-5',
		6: '2xl:gap-6',
		8: '2xl:gap-8',
		10: '2xl:gap-10',
		12: '2xl:gap-12',
		16: '2xl:gap-16',
	},
};

export function resolveResponsive<T extends string | number>(
	value: Responsive<T> | undefined,
	map: Record<Breakpoint, Record<T, string>>,
	defaultValue?: T
): string {
	if (value === undefined) {
		return defaultValue !== undefined ? map.base[defaultValue] || '' : '';
	}

	if (typeof value !== 'object') {
		return map.base[value] || '';
	}

	const classes = Object.entries(value)
		.map(([bp, val]) => {
			if (val === undefined) {
				return '';
			}

			return map[bp as Breakpoint]?.[val as Exclude<T, undefined>] || '';
		})
		.filter(Boolean);

	if (defaultValue !== undefined && value.base === undefined) {
		classes.unshift(map.base[defaultValue] || '');
	}

	return classes.join(' ');
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
	cols?: Responsive<GridCols>;
	gap?: Responsive<GridGap>;
}

export function Grid({
	cols = { base: 1 },
	gap = { base: 6 },
	className = '',
	children,
	...props
}: GridProps) {
	return (
		<div
			className={cn(
				'grid',
				resolveResponsive<GridCols>(cols, colsMap, 1),
				resolveResponsive<GridGap>(gap, gapMap, 6),
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
