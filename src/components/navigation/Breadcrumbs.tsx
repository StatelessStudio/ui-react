import { HTMLAttributes, OlHTMLAttributes, LiHTMLAttributes } from 'react';
import { styles } from '@/style-engine';

const breadcrumbsContainerStyles = styles({
	base: '',
	variants: {},
	defaults: {},
});

export type BreadcrumbsProps = HTMLAttributes<HTMLElement>;

export function Breadcrumbs({ className = '', ...props }: BreadcrumbsProps) {
	return (
		<nav
			aria-label="breadcrumb"
			{...props}
			{...breadcrumbsContainerStyles.render({ className })}
		/>
	);
}

const breadcrumbListStyles = styles({
	base: 'flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-accent sm:gap-2.5',
	variants: {},
	defaults: {},
});

export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;

export function BreadcrumbList({
	className = '',
	...props
}: BreadcrumbListProps) {
	return (
		<ol
			{...props}
			{...breadcrumbListStyles.render({ className })}
		/>
	);
}

const breadcrumbItemStyles = styles({
	base: 'inline-flex items-center gap-1.5',
	variants: {},
	defaults: {},
});

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({
	className = '',
	...props
}: BreadcrumbItemProps) {
	return (
		<li
			{...props}
			{...breadcrumbItemStyles.render({ className })}
		/>
	);
}

const breadcrumbPageStyles = styles({
	base: 'font-semibold text-foreground',
	variants: {},
	defaults: {},
});

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbPage({
	className = '',
	...props
}: BreadcrumbPageProps) {
	return (
		<span
			role="link"
			aria-disabled="true"
			aria-current="page"
			{...props}
			{...breadcrumbPageStyles.render({ className })}
		/>
	);
}

const breadcrumbSeparatorStyles = styles({
	base: 'opacity-50',
	variants: {},
	defaults: {},
});

export type BreadcrumbSeparatorProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbSeparator({
	children = '/',
	className = '',
	...props
}: BreadcrumbSeparatorProps) {
	return (
		<span
			role="presentation"
			aria-hidden="true"
			{...props}
			{...breadcrumbSeparatorStyles.render({ className })}
		>
			{children}
		</span>
	);
}
