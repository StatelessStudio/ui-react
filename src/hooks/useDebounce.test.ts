import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it('should debounce a callback', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test');
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).toHaveBeenCalledWith('test');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should delay callback by specified milliseconds', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 500));

		act(() => {
			result.current('value');
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(callback).toHaveBeenCalledWith('value');
	});

	it('should use default delay of 500ms', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback));

		act(() => {
			result.current('test');
		});

		act(() => {
			vi.advanceTimersByTime(499);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1);
		});

		expect(callback).toHaveBeenCalled();
	});

	it('should cancel pending debounce with cancel()', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test');
		});

		act(() => {
			result.current.cancel();
			vi.advanceTimersByTime(300);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should flush pending debounce with flush()', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test');
		});

		act(() => {
			vi.advanceTimersByTime(100);
			result.current.flush();
		});

		expect(callback).toHaveBeenCalledWith('test');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should reset timer on successive calls', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('first');
			vi.advanceTimersByTime(200);
			result.current('second');
			vi.advanceTimersByTime(200);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(callback).toHaveBeenCalledWith('second');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should react to delay changes', () => {
		const callback = vi.fn();
		const { result, rerender } = renderHook(
			({ delay }: { delay: number }) => useDebounce(callback, delay),
			{ initialProps: { delay: 500 } }
		);

		act(() => {
			result.current('test');
			vi.advanceTimersByTime(500);
		});

		expect(callback).toHaveBeenCalledWith('test');
		callback.mockClear();

		// Change delay to 700
		rerender({ delay: 700 });

		act(() => {
			result.current('test2');
			vi.advanceTimersByTime(500);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(callback).toHaveBeenCalledWith('test2');
	});

	it('should react to callback changes', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();
		const { result, rerender } = renderHook(
			({ fn }: { fn: (val: string) => void }) => useDebounce(fn, 300),
			{ initialProps: { fn: callback1 } }
		);

		act(() => {
			result.current('test');
			vi.advanceTimersByTime(300);
		});

		expect(callback1).toHaveBeenCalledWith('test');
		expect(callback2).not.toHaveBeenCalled();

		rerender({ fn: callback2 });

		act(() => {
			result.current('test2');
			vi.advanceTimersByTime(300);
		});

		expect(callback1).toHaveBeenCalledTimes(1);
		expect(callback2).toHaveBeenCalledWith('test2');
	});

	it('should handle multiple arguments', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('arg1', 'arg2', { key: 'value' });
			vi.advanceTimersByTime(300);
		});

		expect(callback).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
	});

	it('should clear timeout on unmount', () => {
		const callback = vi.fn();
		const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
		const { unmount, result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test');
		});

		unmount();

		expect(clearSpy).toHaveBeenCalled();
		clearSpy.mockRestore();
	});

	it('should not call callback after unmount', () => {
		const callback = vi.fn();
		const { result, unmount } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test');
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should do nothing when flushing with no pending calls', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current.flush();
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should allow successive calls after cancel', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('test1');
			result.current.cancel();
			result.current('test2');
			vi.advanceTimersByTime(300);
		});

		expect(callback).toHaveBeenCalledWith('test2');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should preserve arguments for flush', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebounce(callback, 300));

		act(() => {
			result.current('arg1', 42, true);
			vi.advanceTimersByTime(100);
			result.current.flush();
		});

		expect(callback).toHaveBeenCalledWith('arg1', 42, true);
	});
});
