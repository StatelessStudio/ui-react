import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTableSelection } from './useTableSelection';

interface TestItem {
	id: string;
	name: string;
}

const testData: TestItem[] = [
	{ id: '1', name: 'Item 1' },
	{ id: '2', name: 'Item 2' },
	{ id: '3', name: 'Item 3' },
];

describe('useTableSelection', () => {
	it('should initialize with no selections', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		expect(result.current.selectedIds.size).toBe(0);
		expect(result.current.selectionState).toBe('none');
		expect(result.current.selectedCount).toBe(0);
	});

	it('should select a single row', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectRow('1');
		});

		expect(result.current.selectedIds.has('1')).toBe(true);
		expect(result.current.selectedCount).toBe(1);
		expect(result.current.selectionState).toBe('some');
	});

	it('should deselect a single row', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectRow('1');
		});

		expect(result.current.selectedIds.has('1')).toBe(true);

		act(() => {
			result.current.deselectRow('1');
		});

		expect(result.current.selectedIds.has('1')).toBe(false);
		expect(result.current.selectedCount).toBe(0);
		expect(result.current.selectionState).toBe('none');
	});

	it('should toggle row selection', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		// First toggle: select
		act(() => {
			result.current.toggleRow('1');
		});

		expect(result.current.isSelected('1')).toBe(true);
		expect(result.current.selectedCount).toBe(1);

		// Second toggle: deselect
		act(() => {
			result.current.toggleRow('1');
		});

		expect(result.current.isSelected('1')).toBe(false);
		expect(result.current.selectedCount).toBe(0);
	});

	it('should check if a specific row is selected', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectRow('1');
		});

		expect(result.current.isSelected('1')).toBe(true);
		expect(result.current.isSelected('2')).toBe(false);
	});

	it('should select all rows', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectAll(testData);
		});

		expect(result.current.selectedCount).toBe(3);
		expect(result.current.selectionState).toBe('some');
		testData.forEach((item) => {
			expect(result.current.isSelected(item.id)).toBe(true);
		});
	});

	it('should deselect all rows', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectAll(testData);
		});

		expect(result.current.selectedCount).toBe(3);

		act(() => {
			result.current.deselectAll();
		});

		expect(result.current.selectedCount).toBe(0);
		expect(result.current.selectionState).toBe('none');
	});

	it('should track selection state correctly', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		// Initially 'none'
		expect(result.current.selectionState).toBe('none');

		// After selecting one row: 'some'
		act(() => {
			result.current.selectRow('1');
		});
		expect(result.current.selectionState).toBe('some');

		// After selecting all rows: 'some' (even when all are selected,
		// 	state is 'some' unless using selectAll)
		act(() => {
			result.current.selectRow('2');
			result.current.selectRow('3');
		});
		expect(result.current.selectionState).toBe('some');

		// After deselecting all: 'none'
		act(() => {
			result.current.deselectAll();
		});
		expect(result.current.selectionState).toBe('none');
	});

	it('should handle numeric row IDs', () => {
		const { result } = renderHook(() =>
			useTableSelection({
				getRowId: (item: { id: number; name: string }) => item.id,
			})
		);

		act(() => {
			result.current.selectRow(1);
			result.current.selectRow(2);
		});

		expect(result.current.isSelected(1)).toBe(true);
		expect(result.current.isSelected(2)).toBe(true);
		expect(result.current.isSelected(3)).toBe(false);
		expect(result.current.selectedCount).toBe(2);
	});

	it('should handle mixed string and number selections', () => {
		const { result } = renderHook(() =>
			useTableSelection<{ id: string | number }>({
				getRowId: (item: { id: string | number }) => item.id,
			})
		);

		act(() => {
			result.current.selectRow('id-1');
			result.current.selectRow(42);
		});

		expect(result.current.isSelected('id-1')).toBe(true);
		expect(result.current.isSelected(42)).toBe(true);
		expect(result.current.selectedCount).toBe(2);
	});

	it('should clear selections when selectAll is called with empty array', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectAll(testData);
		});

		expect(result.current.selectedCount).toBe(3);

		act(() => {
			result.current.selectAll([]);
		});

		expect(result.current.selectedCount).toBe(0);
		expect(result.current.selectionState).toBe('none');
	});

	it('should replace selections when selectAll is called', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectRow('1');
		});

		expect(result.current.selectedCount).toBe(1);
		expect(result.current.isSelected('1')).toBe(true);

		act(() => {
			result.current.selectAll([testData[1], testData[2]]);
		});

		// Should now only have 2 and 3 selected, not 1
		expect(result.current.selectedCount).toBe(2);
		expect(result.current.isSelected('1')).toBe(false);
		expect(result.current.isSelected('2')).toBe(true);
		expect(result.current.isSelected('3')).toBe(true);
	});

	it('should maintain selectedIds as a Set', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.selectRow('1');
			result.current.selectRow('2');
		});

		expect(result.current.selectedIds instanceof Set).toBe(true);
		expect(Array.from(result.current.selectedIds)).toEqual(['1', '2']);
	});

	it('should handle rapid toggle operations', () => {
		const { result } = renderHook(() =>
			useTableSelection({ getRowId: (item: TestItem) => item.id })
		);

		act(() => {
			result.current.toggleRow('1');
			result.current.toggleRow('1');
			result.current.toggleRow('1');
		});

		expect(result.current.isSelected('1')).toBe(true);
		expect(result.current.selectedCount).toBe(1);
	});

	it('should work with different getRowId implementations', () => {
		const { result } = renderHook(() =>
			useTableSelection<{
				userId: number;
				postId: string;
			}>({
				getRowId: (item: { userId: number; postId: string }) =>
					`${item.userId}-${item.postId}`,
			})
		);

		act(() => {
			result.current.selectRow('1-a');
			result.current.selectRow('2-a');
		});

		expect(result.current.isSelected('1-a')).toBe(true);
		expect(result.current.isSelected('2-a')).toBe(true);
		expect(result.current.isSelected('1-b')).toBe(false);
		expect(result.current.selectedCount).toBe(2);
	});

	it('shows "all" when totalCount is provided and all rows are selected', () => {
		const { result } = renderHook(() =>
			useTableSelection({
				getRowId: (item: TestItem) => item.id,
				totalCount: testData.length,
			})
		);

		expect(result.current.selectionState).toBe('none');

		act(() => {
			result.current.selectAll(testData);
		});

		expect(result.current.selectionState).toBe('all');
		expect(result.current.selectedCount).toBe(3);
	});

	it('should return "some" when totalCount is greater than selected count', () => {
		const { result } = renderHook(() =>
			useTableSelection({
				getRowId: (item: TestItem) => item.id,
				totalCount: 10, // More than testData.length
			})
		);

		act(() => {
			result.current.selectAll(testData);
		});

		expect(result.current.selectionState).toBe('some');
		expect(result.current.selectedCount).toBe(3);
	});

	it('should correctly toggle between all and some state', () => {
		const { result } = renderHook(() =>
			useTableSelection({
				getRowId: (item: TestItem) => item.id,
				totalCount: testData.length,
			})
		);

		act(() => {
			result.current.selectAll(testData);
		});
		expect(result.current.selectionState).toBe('all');

		act(() => {
			result.current.deselectRow('1');
		});
		expect(result.current.selectionState).toBe('some');

		act(() => {
			result.current.selectRow('1');
		});
		expect(result.current.selectionState).toBe('all');

		act(() => {
			result.current.deselectAll();
		});
		expect(result.current.selectionState).toBe('none');
	});
});
