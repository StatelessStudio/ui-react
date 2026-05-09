import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
	it('should manage uncontrolled state correctly', () => {
		const { result } = renderHook(() =>
			useControllableState({ defaultValue: 'default' })
		);

		expect(result.current[0]).toBe('default');

		act(() => {
			result.current[1]('changed');
		});

		expect(result.current[0]).toBe('changed');
	});

	it('should use controlled value over defaultValue', () => {
		const { result } = renderHook(() =>
			useControllableState({ value: 'controlled', defaultValue: 'default' })
		);

		expect(result.current[0]).toBe('controlled');
	});

	it('should trigger onChange when value changes', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useControllableState({ defaultValue: 'default', onChange })
		);

		act(() => {
			result.current[1]('changed');
		});

		expect(onChange).toHaveBeenCalledWith('changed');
	});
});
