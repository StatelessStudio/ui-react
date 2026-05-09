import { useState, useCallback } from 'react';

export type SelectionState = 'none' | 'some' | 'all';

export interface UseTableSelectionOptions<T> {
	/**
	 * Function to get a unique identifier for each row.
	 * @param item The row item
	 * @returns A unique identifier
	 */
	getRowId: (item: T) => string | number;
	/**
	 * Whether to clear selection when data changes.
	 * @default true
	 */
	clearOnDataChange?: boolean;
	/**
	 * Total number of rows available for selection.
	 * Required to determine 'all' selection state for tri-state checkbox.
	 */
	totalCount?: number;
}

export interface UseTableSelectionReturn<T> {
	/** Set of currently selected row IDs */
	selectedIds: Set<string | number>;
	/** Current selection state: 'none', 'some', or 'all' */
	selectionState: SelectionState;
	/** Toggle a single row's selection */
	toggleRow: (id: string | number) => void;
	/** Select a single row */
	selectRow: (id: string | number) => void;
	/** Deselect a single row */
	deselectRow: (id: string | number) => void;
	/** Select all rows in the current data set */
	selectAll: (items: T[]) => void;
	/** Deselect all rows */
	deselectAll: () => void;
	/** Check if a specific row is selected */
	isSelected: (id: string | number) => boolean;
	/** Get the count of selected rows */
	selectedCount: number;
}

/**
 * Hook for managing data table row selection state.
 *
 * @example
 * ```tsx
 * const selection = useTableSelection({
 *   getRowId: (item) => item.id,
 *   totalCount: data.length, // Required for tri-state checkbox ("all" state)
 * });
 *
 * return (
 *   <DataTable
 *     data={data}
 *     columns={[
 *       {
 *         header: (
 *           <input
 *             type="checkbox"
 *             checked={selection.selectionState === 'all'}
 *             ref={(input) => {
 *               if (input) {
 *                 input.indeterminate = selection.selectionState === 'some';
 *               }
 *             }}
 *             onChange={() =>
 *               selection.selectionState === 'all'
 *                 ? selection.deselectAll()
 *                 : selection.selectAll(data)
 *             }
 *           />
 *         ),
 *         key: 'select',
 *         cell: (item) => (
 *           <input
 *             type="checkbox"
 *             checked={selection.isSelected(item.id)}
 *             onChange={() => selection.toggleRow(getRowId(item))}
 *           />
 *         ),
 *       },
 *       // ... other columns
 *     ]}
 *   />
 * );
 * ```
 */
export function useTableSelection<T>({
	getRowId,
	totalCount,
}: UseTableSelectionOptions<T>): UseTableSelectionReturn<T> {
	const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
		new Set()
	);

	const toggleRow = useCallback((id: string | number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			}
			else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const selectRow = useCallback((id: string | number) => {
		setSelectedIds((prev) => new Set(prev).add(id));
	}, []);

	const deselectRow = useCallback((id: string | number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const selectAll = useCallback(
		(items: T[]) => {
			const ids = new Set(items.map(getRowId));
			setSelectedIds(ids);
		},
		[getRowId]
	);

	const deselectAll = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const isSelected = useCallback(
		(id: string | number) => selectedIds.has(id),
		[selectedIds]
	);

	// Determine selection state
	let selectionState: SelectionState = 'none';
	if (selectedIds.size > 0) {
		// If totalCount is provided and all rows are selected, state is 'all'
		selectionState =
			totalCount !== undefined && selectedIds.size === totalCount
				? 'all'
				: 'some';
	}

	return {
		selectedIds,
		selectionState,
		toggleRow,
		selectRow,
		deselectRow,
		selectAll,
		deselectAll,
		isSelected,
		selectedCount: selectedIds.size,
	};
}
