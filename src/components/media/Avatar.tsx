'use client';

import React, { useState, useEffect } from 'react';
import { styles, StyleProps } from '@/style-engine';

const avatarStyles = styles({
	base:
		'relative inline-flex shrink-0 items-center justify-center overflow-hidden ' +
		'bg-muted font-medium text-muted-foreground',
	variants: {
		size: {
			sm: 'h-8 w-8 text-xs',
			md: 'h-10 w-10 text-sm',
			lg: 'h-12 w-12 text-base',
			xl: 'h-16 w-16 text-lg',
			'2xl': 'h-24 w-24 text-2xl',
		},
		shape: {
			circle: 'rounded-full',
			square: 'rounded-md',
		},
	},
	defaults: {
		size: 'md',
		shape: 'circle',
	},
});

const imageStyles = styles({
	base: 'h-full w-full object-cover',
	variants: {},
});

type AvatarVariantProps = StyleProps<typeof avatarStyles>;

export interface AvatarProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarVariantProps>,
		AvatarVariantProps {
	src?: string;
	alt?: string;
	initials?: string;
	imageComponent?: React.ElementType;
	imageProps?: Record<string, unknown>;
}

export function Avatar({
	src,
	alt = '',
	initials,
	imageComponent: ImageComponent = 'img',
	imageProps = {},
	size = avatarStyles.defaults.size,
	shape = avatarStyles.defaults.shape,
	className = '',
	...props
}: AvatarProps) {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(false);
	}, [src]);

	return (
		<div
			{...props}
			{...avatarStyles.render({ size, shape, className })}
		>
			{src && !hasError ? (
				<ImageComponent
					src={src}
					alt={alt}
					onError={() => setHasError(true)}
					{...imageStyles.render({
						className: imageProps['className'] as string,
					})}
					{...imageProps}
				/>
			) : (
				<span className="uppercase">{initials}</span>
			)}
		</div>
	);
}
