import * as React from 'react';

interface UseControllableStateProps<T> {
	value?: T;
	defaultValue?: T | (() => T);
	onChange?: (value: T) => void;
}

/**
 * A utility to keep a stable reference to a callback
 * so it can be safely used inside a stable useCallback.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useCallbackRef<T extends (...args: any[]) => any>(
	callback: T | undefined
): T {
	const callbackRef = React.useRef(callback);

	React.useEffect(() => {
		callbackRef.current = callback;
	});

	return React.useCallback(
		((...args) => callbackRef.current?.(...args)) as T,
		[]
	);
}

/**
 * A hook that manages controllable state.
 *
 * If a `value` is provided, it is considered controlled and the component
 * 	using this hook should rely on that `value` rather than internal state.
 *
 * If no `value` is provided, it manages its own internal state starting
 * 	from `defaultValue`.
 */
export function useControllableState<T>({
	value: valueProp,
	defaultValue,
	onChange,
}: UseControllableStateProps<T>): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [uncontrolledState, setUncontrolledState] = React.useState<T>(
		defaultValue as T
	);
	const isControlled = valueProp !== undefined;
	const value = isControlled ? (valueProp as T) : uncontrolledState;

	const onChangeRef = useCallbackRef(onChange);

	const isControlledRef = React.useRef(isControlled);
	const valuePropRef = React.useRef(valueProp);
	const prevValueRef = React.useRef(value);

	React.useEffect(() => {
		isControlledRef.current = isControlled;
		valuePropRef.current = valueProp;
	});

	const setValue = React.useCallback(
		(nextValue: React.SetStateAction<T>) => {
			if (isControlledRef.current) {
				const setter = nextValue as (prevState: T) => T;
				const resolvedValue =
					typeof nextValue === 'function'
						? setter(valuePropRef.current as T)
						: nextValue;

				// For controlled components, don't update internal state
				// Just mark that we need to call onChange
				if (!Object.is(valuePropRef.current, resolvedValue)) {
					onChangeRef(resolvedValue);
				}
			}
			else {
				// For uncontrolled components, update internal state
				// onChange will be called in the effect below
				setUncontrolledState(nextValue);
			}
		},
		[onChangeRef]
	);

	// Call onChange when uncontrolled state changes
	React.useEffect(() => {
		if (!isControlledRef.current) {
			if (!Object.is(prevValueRef.current, value)) {
				onChangeRef(value);
			}
		}

		prevValueRef.current = value;
	}, [value, onChangeRef]);

	return [value, setValue];
}
