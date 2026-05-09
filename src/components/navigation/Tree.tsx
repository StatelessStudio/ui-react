'use client';

import React from 'react';
import { styles } from '../../style-engine';

const treeStyles = styles({
	base: 'flex flex-col space-y-1 w-full',
	variants: {},
	defaults: {},
});

export type TreeProps = React.HTMLAttributes<HTMLUListElement>;

export function Tree({ className = '', children, ...props }: TreeProps) {
	return (
		<ul
			role="tree"
			{...treeStyles.render({ className })}
			{...props}
		>
			{children}
		</ul>
	);
}
