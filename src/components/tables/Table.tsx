import {
	HTMLAttributes,
	TableHTMLAttributes,
	TdHTMLAttributes,
	ThHTMLAttributes,
} from 'react';
import { styles } from '@/style-engine';

const tableWrapperStyles = styles({
	base: 'w-full overflow-auto',
	variants: {},
	defaults: {},
});

const tableStyles = styles({
	base: 'w-full caption-bottom text-sm',
	variants: {},
	defaults: {},
});

const tableHeaderStyles = styles({
	base: '[&_tr]:border-b',
	variants: {},
	defaults: {},
});

const tableBodyStyles = styles({
	base: '[&_tr:last-child]:border-0',
	variants: {},
	defaults: {},
});

const tableFooterStyles = styles({
	base: 'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
	variants: {},
	defaults: {},
});

const tableRowStyles = styles({
	base: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
	variants: {},
	defaults: {},
});

const tableHeadStyles = styles({
	base: 'h-12 px-4 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0',
	variants: {},
	defaults: {},
});

const tableCellStyles = styles({
	base: 'p-4 align-middle [&:has([role=checkbox])]:pr-0',
	variants: {},
	defaults: {},
});

const tableCaptionStyles = styles({
	base: 'mt-4 text-sm text-foreground',
	variants: {},
	defaults: {},
});

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
	wrapperClassName?: string;
}

export function Table({
	wrapperClassName = '',
	className = '',
	...props
}: TableProps) {
	return (
		<div
			{...tableWrapperStyles.render({
				className: wrapperClassName,
			})}
		>
			<table
				{...tableStyles.render({ className })}
				{...props}
			/>
		</div>
	);
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableHeader({ className = '', ...props }: TableHeaderProps) {
	return (
		<thead
			{...tableHeaderStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ className = '', ...props }: TableBodyProps) {
	return (
		<tbody
			{...tableBodyStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableFooter({ className = '', ...props }: TableFooterProps) {
	return (
		<tfoot
			{...tableFooterStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className = '', ...props }: TableRowProps) {
	return (
		<tr
			{...tableRowStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

export function TableHead({ className = '', ...props }: TableHeadProps) {
	return (
		<th
			{...tableHeadStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ className = '', ...props }: TableCellProps) {
	return (
		<td
			{...tableCellStyles.render({ className })}
			{...props}
		/>
	);
}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

export function TableCaption({ className = '', ...props }: TableCaptionProps) {
	return (
		<caption
			{...tableCaptionStyles.render({ className })}
			{...props}
		/>
	);
}
