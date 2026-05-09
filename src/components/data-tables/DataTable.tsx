'use client';

import React from 'react';
import { cn, styles } from '@/style-engine';
import { ChevronUpIcon, ChevronDownIcon } from '@/icons';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../tables/Table';
import { Pagination } from '../navigation/Pagination';
import { Select } from '../forms/Select';
import { Spinner } from '../progress/Spinner';

const dataTableWrapperStyles = styles({
	base: 'space-y-4',
});

const dataTableTableWrapperStyles = styles({
	base: 'relative rounded-md',
});

const dataTableLoadingOverlayStyles = styles({
	base: 'absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[1px] pt-14',
});

const dataTablePaginationWrapperStyles = styles({
	base: 'flex items-center justify-between p-2',
});

const dataTablePaginationLeftStyles = styles({
	base: 'flex items-center gap-2',
});

const dataTablePageSizeTextStyles = styles({
	base: 'whitespace-nowrap text-sm font-medium text-foreground/80',
});

export interface ColumnDef<T> {
	key: string;
	header: React.ReactNode;
	cell?: (item: T) => React.ReactNode;
	sortable?: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface TableState {
	page: number;
	pageSize: number;
	sortKey?: string;
	sortDirection?: SortDirection;
}

export interface DataTableProps<
	T,
> extends React.HTMLAttributes<HTMLDivElement> {
	columns: ColumnDef<T>[];
	data: T[];
	isLoading?: boolean;

	// Unified State Option
	state?: TableState;
	onStateChange?: (state: TableState) => void;

	// Fine-grained Options
	sortKey?: string;
	sortDirection?: SortDirection;
	onSort?: (key: string, direction: SortDirection) => void;
	pagination?: {
		currentPage?: number;
		totalPages: number;
		onPageChange?: (page: number) => void;
		pageSize?: number;
		pageSizeOptions?: number[];
		onPageSizeChange?: (pageSize: number) => void;
	};
	getRowKey?: (row: T) => string | number;
}

export function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	isLoading = false,
	state,
	onStateChange,
	sortKey,
	sortDirection,
	onSort,
	pagination,
	getRowKey,
	className = '',
	...props
}: DataTableProps<T>) {
	const currentSortKey = state?.sortKey ?? sortKey;
	const currentSortDirection = state?.sortDirection ?? sortDirection;
	const currentPage = state?.page ?? pagination?.currentPage ?? 1;
	const currentPageSize = state?.pageSize ?? pagination?.pageSize ?? 10;

	const handleSort = (key: string, isSortable?: boolean) => {
		if (!isSortable) {
			return;
		}

		const nextDirection =
			currentSortKey === key && currentSortDirection === 'asc' ? 'desc' : 'asc';

		if (onSort) {
			onSort(key, nextDirection);
		}

		if (onStateChange) {
			onStateChange({
				page: 1, // Usually sorting resets pagination
				pageSize: currentPageSize,
				sortKey: key,
				sortDirection: nextDirection,
			});
		}
	};

	const handlePageChange = (page: number) => {
		if (pagination?.onPageChange) {
			pagination.onPageChange(page);
		}

		if (onStateChange) {
			onStateChange({
				page,
				pageSize: currentPageSize,
				sortKey: currentSortKey,
				sortDirection: currentSortDirection,
			});
		}
	};

	const handlePageSizeChange = (pageSize: number) => {
		if (pagination?.onPageSizeChange) {
			pagination.onPageSizeChange(pageSize);
		}

		if (onStateChange) {
			onStateChange({
				page: 1, // Usually changing page size resets to the first page
				pageSize,
				sortKey: currentSortKey,
				sortDirection: currentSortDirection,
			});
		}
	};

	return (
		<div
			{...dataTableWrapperStyles.render({ className })}
			{...props}
		>
			<div {...dataTableTableWrapperStyles.render({})}>
				{isLoading && (
					<div {...dataTableLoadingOverlayStyles.render({})}>
						<Spinner
							size="lg"
							aria-label="Loading table data"
						/>
					</div>
				)}
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((col) => (
								<TableHead
									key={col.key as string}
									className={cn(
										'group rounded-t-xl',
										col.sortable && (onSort || onStateChange)
											? 'cursor-pointer select-none hover:bg-muted/50'
											: ''
									)}
									onClick={() => handleSort(col.key as string, col.sortable)}
									aria-sort={
										currentSortKey === col.key
											? currentSortDirection === 'asc'
												? 'ascending'
												: 'descending'
											: 'none'
									}
								>
									<div className="flex items-center gap-1.5">
										<span>{col.header}</span>
										{col.sortable && (onSort || onStateChange) && (
											<span className="flex items-center justify-center text-muted-foreground">
												{currentSortKey === col.key ? (
													currentSortDirection === 'asc' ? (
														<ChevronUpIcon
															width="14"
															height="14"
														/>
													) : (
														<ChevronDownIcon
															width="14"
															height="14"
														/>
													)
												) : (
													<ChevronUpIcon
														width="14"
														height="14"
														className="opacity-0 group-hover:opacity-50"
													/>
												)}
											</span>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length ? (
							data.map((row, i) => (
								<TableRow key={getRowKey ? getRowKey(row) : i}>
									{columns.map((col) => (
										<TableCell key={col.key as string}>
											{col.cell
												? col.cell(row)
												: (row[col.key as keyof T] as React.ReactNode)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-foreground"
								>
									{isLoading ? '' : 'No results.'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{pagination &&
				(pagination.totalPages > 1 || pagination.pageSizeOptions) && (
					<div {...dataTablePaginationWrapperStyles.render({})}>
						<div {...dataTablePaginationLeftStyles.render({})}>
							{pagination.pageSizeOptions &&
								(pagination.onPageSizeChange || onStateChange) && (
									<>
										<Select
											value={currentPageSize}
											onChange={(e) =>
												handlePageSizeChange(Number(e.target.value))
											}
											className="w-[80px] text-sm"
										>
											{pagination.pageSizeOptions.map((size) => (
												<option
													key={size}
													value={size}
												>
													{size}
												</option>
											))}
										</Select>
										<span {...dataTablePageSizeTextStyles.render({})}>
											rows per page
										</span>
									</>
								)}
						</div>
						<div>
							<Pagination
								currentPage={currentPage}
								totalPages={pagination.totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					</div>
				)}
		</div>
	);
}
