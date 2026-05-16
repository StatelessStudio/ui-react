import React from 'react';
import { PageHeading, Stack } from '@/components/layout';
import {
	DataTable,
	TableState,
	DataTableProps,
} from '@/components/data-tables';
import { Card, CardContent } from '@/components/cards';
import { Toolbar, ToolbarGroup } from '@/components/toolbars';
import { Alert } from '@/components/feedback';
import { Checkbox, Search } from '@/components/forms';
import { UseTableSelectionReturn } from '@/hooks';
import { ColumnDef } from '@/components/data-tables/DataTable';
import { cn } from '@/style-engine';

export type GetRowKey<T> = (row: T) => string | number;

export interface ResourceListViewProps<T> {
	title: string;
	data: T[];
	columns: DataTableProps<T>['columns'];
	isLoading?: boolean;
	isError?: boolean;
	errorTitle?: string;
	errorMessage?: string;
	tableState: TableState;
	onTableStateChange: (state: TableState) => void;

	// Pagination
	pagination?: DataTableProps<T>['pagination'];
	totalCount?: number;
	pageSizeOptions?: number[];

	// Row logic
	getRowKey: GetRowKey<T>;

	// Selection
	selection?: UseTableSelectionReturn<T>;

	// Actions
	toolbarActions?: React.ReactNode;
	selectionActions?: React.ReactNode;

	// Search
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	className?: string;
}

export function ResourceListView<T>({
	title,
	data,
	columns,
	isLoading,
	isError,
	errorTitle = 'Error loading data',
	errorMessage = 'An unknown error occurred',
	tableState,
	onTableStateChange,
	pagination,
	getRowKey,
	selection,
	totalCount,
	pageSizeOptions = [5, 10, 20, 50],
	toolbarActions,
	selectionActions,
	searchValue,
	onSearchChange,
	searchPlaceholder = 'Search...',
	className,
}: ResourceListViewProps<T>) {
	const computedColumns = React.useMemo(() => {
		let cols = [...columns];

		if (selection) {
			cols = [
				{
					header: (
						<Checkbox
							checked={
								selection.selectedCount === data.length && data.length > 0
							}
							ref={(input) => {
								if (input) {
									const sc = selection.selectedCount;
									const len = data.length;
									input.indeterminate = sc > 0 && sc < len;
								}
							}}
							onChange={() => {
								const isAllSelected =
									selection.selectedCount === data.length && data.length > 0;
								if (isAllSelected) {
									selection.deselectAll();
								}
								else {
									selection.selectAll(data);
								}
							}}
							aria-label="Select all items"
						/>
					),
					key: 'select',
					cell: (row) => (
						<Checkbox
							checked={selection.isSelected(getRowKey(row))}
							onChange={() => selection.toggleRow(getRowKey(row))}
							aria-label="Select item"
						/>
					),
					className: 'w-12',
				},
				...cols,
			];
		}
		return cols;
	}, [columns, selection, data, getRowKey]);

	let computedPagination = pagination;
	if (!computedPagination && totalCount !== undefined) {
		computedPagination = {
			totalPages: totalCount ? Math.ceil(totalCount / tableState.pageSize) : 1,
			pageSizeOptions,
		};
	}

	return (
		<Stack
			gap="md"
			className={cn('flex-1 h-full min-h-0 flex-col', className)}
		>
			<PageHeading
				title={title}
				className="pb-0 mb-0"
				actions={
					toolbarActions || selectionActions || onSearchChange ? (
						<Toolbar className="w-full gap-4">
							{onSearchChange && (
								<ToolbarGroup className="flex-1">
									<Search
										value={searchValue || ''}
										onChange={(e) => onSearchChange(e.target.value)}
										placeholder={searchPlaceholder}
										className="w-64 max-w-sm"
									/>
								</ToolbarGroup>
							)}
							<ToolbarGroup className="ml-auto">
								{selectionActions}
								{toolbarActions}
							</ToolbarGroup>
						</Toolbar>
					) : undefined
				}
			/>
			{isError && (
				<Alert
					color="danger"
					title={errorTitle}
				>
					{errorMessage}
				</Alert>
			)}
			<Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
				<CardContent className="p-0 flex-1 min-h-0 flex flex-col">
					<DataTable
						columns={computedColumns as ColumnDef<Record<string, unknown>>[]}
						data={data as Record<string, unknown>[]}
						isLoading={isLoading}
						getRowKey={getRowKey as GetRowKey<Record<string, unknown>>}
						state={tableState}
						onStateChange={onTableStateChange}
						pagination={computedPagination}
					/>
				</CardContent>
			</Card>
		</Stack>
	);
}
