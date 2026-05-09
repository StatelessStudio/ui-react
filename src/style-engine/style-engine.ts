/// <reference types="vite/client" />
import { ComponentPropsWithRef, ElementType } from 'react';
import { cn } from './cn';

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/**
 * A class list can be a string of space-separated classes or an array of
 *  class strings.
 */
export type ClassList = string | string[];

/**
 * An object mapping option keys to their class lists.
 */
export type VariantOptions = Record<string | number, ClassList>;

/**
 * An object mapping variant names to their options.
 */
export type Variants = Record<string, VariantOptions>;

/**
 * All variants resolved to a concrete selection.
 */
export type FullVariantSelection<T extends Variants> = {
	[K in keyof T]: keyof T[K];
};

/**
 * Partial variant selection — used for component props.
 */
export type VariantSelection<T extends Variants> = Partial<
	FullVariantSelection<T>
>;

// ---------------------------------------------------------------------------
// StylesDef — the object returned by styles() and .extend()
// ---------------------------------------------------------------------------

/**
 * Input accepted by {@link StylesDef.render}.
 * Variant selections to be applied.
 */
export type RenderInput<TVariants extends Variants> =
	VariantSelection<TVariants> & {
		/**
		 * Extra classes merged after all variant classes.
		 * Typically passed from the component's `className` prop
		 */
		className?: string;
	};

/**
 * A composable, renderable style definition.
 *
 * Created via `styles({...})`. Extended via `.extend({...})`.
 */
export type StylesDef<TVariants extends Variants> = {
	/**
	 * Render the final class string for the given variant selection.
	 * Returns an object with a single `className` property.
	 *
	 * @param input Variant selections (merged with defaults).
	 * @param options Additional render options (future-use)
	 * @returns Object containing the computed `className`
	 */
	render(input?: RenderInput<TVariants>): { className: string };

	/**
	 * Default variant selections defined in this style definition.
	 * Access individual defaults: `buttonStyles.defaults.size`,
	 * 	`buttonStyles.defaults.color`
	 * Useful for component signatures:
	 * 	`function Button({ size = buttonStyles.defaults.size, ... })`
	 */
	defaults: Partial<FullVariantSelection<TVariants>>;

	/**
	 * Create a new StylesDef that inherits all variants, defaults, and rules
	 * from this definition and merges in the provided config.
	 *
	 * @example
	 * const buttonStyles = baseStyles.extend({
	 *   variants: { fill: { solid: '', outline: 'bg-transparent border' } },
	 *   defaults: { fill: 'solid' },
	 * });
	 */
	extend<TNew extends Variants = Record<string, never>>(
		config: StylesExtendConfig<TVariants, TNew>
	): StylesDef<TVariants & TNew>;
};

// ---------------------------------------------------------------------------
// Config types
// ---------------------------------------------------------------------------

/**
 * Rule function used in the composed rules array.
 */
export type RuleFn<TVariants extends Variants = Variants> = (
	opts: VariantSelection<TVariants>
) => ClassList | undefined;

/**
 * Shared behavior config used by both `styles()` and `.extend()`.
 */
export interface StyleBehaviorConfig<TVariants extends Variants> {
	/**
	 * Classes applied unconditionally.
	 */
	base?: ClassList;

	/**
	 * Default option for each variant when none is provided.
	 */
	defaults?: VariantSelection<TVariants>;

	/**
	 * Programmatic rule callback for cross-variant logic.
	 * Receives the resolved selection (defaults are applied;
	 * 	unspecified keys may be absent).
	 * Return a ClassList to append, or undefined to skip.
	 */
	rules?: RuleFn<TVariants>;
}

/**
 * Config accepted by the top-level `styles()` factory.
 */
export interface StylesConfig<
	TVariants extends Variants,
> extends StyleBehaviorConfig<TVariants> {
	/**
	 * Variant definitions.
	 */
	variants: TVariants;
}

/**
 * Config accepted by `.extend()`.
 */
export interface StylesExtendConfig<
	TBase extends Variants,
	TNew extends Variants = Record<string, never>,
> extends StyleBehaviorConfig<TBase & TNew> {
	/**
	 * New or overriding variant definitions.
	 */
	variants?: TNew;
}

// ---------------------------------------------------------------------------
// StyleProps helper — infer variant prop types from a StylesDef
// ---------------------------------------------------------------------------

/**
 * Extract the variant map type from a StylesDef instance.
 */
export type StyleVariants<T extends StylesDef<Variants>> =
	T extends StylesDef<infer TVariants> ? TVariants : Variants;

/**
 * Variant props inferred from a StylesDef instance.
 *
 * @example
 * type ButtonVariantProps = StyleProps<typeof buttonStyles>;
 */
export type StyleProps<T extends StylesDef<Variants>> = VariantSelection<
	StyleVariants<T>
>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * A strict polymorphic utility for React 19.
 * Extracts the correct native attributes and explicitly infers the `ref` prop
 * without requiring `forwardRef`.
 */
export type PolymorphicProps<
	E extends ElementType,
	P = Record<string, never>,
> = Omit<ComponentPropsWithRef<E>, 'as' | keyof P> &
	P & {
		as?: E;
	};

/**
 * Coerce a ClassList to a string[].
 */
export function asArray(value: ClassList): string[] {
	return Array.isArray(value) ? value : value ? [value] : [];
}

/**
 * Resolves the class strings for each variant key in the given selection,
 * looking up the chosen option in the variant map and collecting the results.
 */
function resolveVariantClasses(
	allVariants: Variants,
	selection: VariantSelection<Variants>
): string[] {
	const classes: string[] = [];

	for (const key of Object.keys(allVariants)) {
		const chosen = selection[key];

		if (chosen === null || chosen === undefined) {
			continue;
		}

		const variantClass = allVariants[key][chosen as string];

		if (import.meta.env.DEV && variantClass === undefined) {
			// eslint-disable-next-line no-console
			console.warn(
				`[styles] Unknown option "${String(chosen)}" for variant "${key}". ` +
					`Valid options: ${Object.keys(allVariants[key]).join(', ')}`
			);
		}

		if (variantClass) {
			classes.push(...asArray(variantClass));
		}
	}

	return classes;
}

// ---------------------------------------------------------------------------
// Internal factory
// ---------------------------------------------------------------------------

/**
 * Internal factory that constructs a {@link StylesDef} from its constituent
 * parts. Both `styles()` and `.extend()` ultimately delegate here.
 */
function createStylesDef<TVariants extends Variants>(
	baseClasses: ClassList,
	allVariants: TVariants,
	allDefaults: VariantSelection<TVariants>,
	rules: RuleFn[]
): StylesDef<TVariants> {
	/**
	 * Render the final class string for the given variant selection.
	 *
	 * @param input Variant selections (will be merged with defaults).
	 * @returns Object with computed `className`
	 */
	function render(input: RenderInput<TVariants> = {}): { className: string } {
		// Filter out undefined values so defaults aren't overwritten
		const filteredSelection = Object.fromEntries(
			Object.entries(input).filter(([, v]) => v !== undefined)
		) as VariantSelection<TVariants>;

		const resolved = {
			...allDefaults,
			...filteredSelection,
		} as FullVariantSelection<Variants>;

		const classes = [
			...asArray(baseClasses),
			...resolveVariantClasses(allVariants as Variants, resolved),
		];

		for (const rule of rules) {
			const extra = rule(resolved);

			if (extra) {
				classes.push(...asArray(extra));
			}
		}

		return { className: cn(...classes, input.className) };
	}

	/**
	 * Create a new Styles Definition that extends this one with the given config.
	 *
	 * @param config Extension config (new/overridden variants, base classes, etc).
	 * @returns A new StylesDef instance with the merged configuration.
	 */
	function extend<TNew extends Variants = Record<string, never>>(
		config: StylesExtendConfig<TVariants, TNew>
	): StylesDef<TVariants & TNew> {
		type TMerged = TVariants & TNew;

		const mergedBase: ClassList = config.base
			? [...asArray(baseClasses), ...asArray(config.base)]
			: baseClasses;

		const mergedVariants = {
			...allVariants,
			...(config.variants ?? {}),
		} as TMerged;

		const mergedDefaults = {
			...allDefaults,
			...(config.defaults ?? {}),
		} as VariantSelection<TMerged>;

		const mergedRules: RuleFn[] = config.rules
			? [...rules, config.rules as RuleFn]
			: rules;

		return createStylesDef(
			mergedBase,
			mergedVariants,
			mergedDefaults,
			mergedRules
		);
	}

	return { render, extend, defaults: allDefaults };
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

/**
 * Create a StylesDef from a config object.
 *
 * @example
 * const alertStyles = styles({
 *   base: 'rounded-md p-4',
 *   variants: { color: colorStyles },
 *   defaults: { color: 'info' },
 * });
 *
 * // Extend for a child component:
 * const toastStyles = alertStyles.extend({
 *   variants: { position: { top: 'top-4', bottom: 'bottom-4' } },
 * });
 *
 * // In a component:
 * alertStyles.render({ color, className })
 */
export function styles<TVariants extends Variants>(
	config: StylesConfig<TVariants>
): StylesDef<TVariants> {
	return createStylesDef(
		config.base ?? '',
		config.variants,
		config.defaults ?? {},
		config.rules ? [config.rules as RuleFn] : []
	);
}
