import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { styles, asArray, StyleProps } from './style-engine';

// ---------------------------------------------------------------------------
// asArray
// ---------------------------------------------------------------------------

describe('asArray', () => {
	it('returns an empty array for an empty string', () => {
		expect(asArray('')).toEqual([]);
	});

	it('wraps a non-empty string in an array', () => {
		expect(asArray('foo bar')).toEqual(['foo bar']);
	});

	it('returns an array as-is', () => {
		expect(asArray(['foo', 'bar'])).toEqual(['foo', 'bar']);
	});
});

// ---------------------------------------------------------------------------
// styles() — base classes
// ---------------------------------------------------------------------------

describe('styles() base classes', () => {
	it('renders base string classes', () => {
		const s = styles({ base: 'flex items-center', variants: {} });
		const result = s.render();
		expect(result.className).toContain('flex');
		expect(result.className).toContain('items-center');
	});

	it('renders base array classes', () => {
		const s = styles({ base: ['flex', 'items-center'], variants: {} });
		const result = s.render();
		expect(result.className).toContain('flex');
		expect(result.className).toContain('items-center');
	});

	it('renders with no base defined', () => {
		const s = styles({ variants: {} });
		expect(s.render().className).toBe('');
	});
});

// ---------------------------------------------------------------------------
// styles() — variant selection
// ---------------------------------------------------------------------------

describe('styles() variant selection', () => {
	const s = styles({
		base: 'base',
		variants: {
			size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
			intent: { primary: 'bg-primary', danger: 'bg-danger' },
		},
	});

	it('applies a selected variant', () => {
		expect(s.render({ size: 'sm' }).className).toContain('text-sm');
	});

	it('applies multiple selected variants', () => {
		const result = s.render({ size: 'lg', intent: 'danger' });
		expect(result.className).toContain('text-lg');
		expect(result.className).toContain('bg-danger');
	});

	it('does not apply unselected variants without defaults', () => {
		const result = s.render({});
		expect(result.className).not.toContain('text-sm');
		expect(result.className).not.toContain('bg-primary');
	});
});

// ---------------------------------------------------------------------------
// styles() — defaults
// ---------------------------------------------------------------------------

describe('styles() defaults', () => {
	const s = styles({
		variants: {
			size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
		},
		defaults: { size: 'md' },
	});

	it('applies default when no option provided', () => {
		expect(s.render().className).toContain('text-md');
	});

	it('overrides default when option is provided', () => {
		const result = s.render({ size: 'lg' });
		expect(result.className).toContain('text-lg');
		expect(result.className).not.toContain('text-md');
	});

	it('applies default when render called with empty object', () => {
		expect(s.render({}).className).toContain('text-md');
	});

	it('applies default when undefined is explicitly passed', () => {
		expect(s.render({ size: undefined }).className).toContain('text-md');
	});
});

describe('styles() multiple defaults with undefined values', () => {
	const s = styles({
		variants: {
			size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
			shape: { circle: 'rounded-full', square: 'rounded-md' },
		},
		defaults: { size: 'md', shape: 'circle' },
	});

	it('applies all defaults when no selection provided', () => {
		const result = s.render();
		expect(result.className).toContain('text-md');
		expect(result.className).toContain('rounded-full');
	});

	it('applies defaults when no variants are provided', () => {
		const result = s.render({ size: 'lg', shape: undefined });
		expect(result.className).toContain('text-lg');
		expect(result.className).toContain('rounded-full');
		expect(result.className).not.toContain('text-md');
	});

	it('applies defaults for all undefined variants', () => {
		const result = s.render({ size: undefined, shape: undefined });
		expect(result.className).toContain('text-md');
		expect(result.className).toContain('rounded-full');
	});

	it('does not override explicit selections', () => {
		const result = s.render({ size: 'sm', shape: undefined });
		expect(result.className).toContain('text-sm');
		expect(result.className).toContain('rounded-full');
		expect(result.className).not.toContain('text-md');
	});
});

// ---------------------------------------------------------------------------
// styles() rules callback
// ---------------------------------------------------------------------------

describe('styles() rules callback', () => {
	it('fires with the fully resolved selection', () => {
		const rulesFn = vi.fn(() => undefined);
		const s = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
			defaults: { size: 'md' },
			rules: rulesFn,
		});

		s.render({ size: 'sm' });
		expect(rulesFn).toHaveBeenCalledWith({ size: 'sm' });
	});

	it('fires with defaults when no selection provided', () => {
		const rulesFn = vi.fn(() => undefined);
		const s = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
			defaults: { size: 'md' },
			rules: rulesFn,
		});

		s.render();
		expect(rulesFn).toHaveBeenCalledWith({ size: 'md' });
	});

	it('appends classes returned by rules', () => {
		const s = styles({
			variants: {
				size: { sm: 'text-sm', md: 'text-md' },
				intent: { primary: 'bg-primary', danger: 'bg-danger' },
			},
			rules: ({ size, intent }) =>
				size === 'sm' && intent === 'danger' ? 'special-combo' : undefined,
		});

		const result1 = s.render({ size: 'sm', intent: 'danger' });
		expect(result1.className).toContain('special-combo');

		const result2 = s.render({ size: 'md', intent: 'danger' });
		expect(result2.className).not.toContain('special-combo');
	});
});

// ---------------------------------------------------------------------------
// styles() — falsy variant key edge cases
// ---------------------------------------------------------------------------

describe('styles() falsy variant key handling', () => {
	it('handles a variant option key of "0"', () => {
		const s = styles({
			variants: { count: { '0': 'count-zero', '1': 'count-one' } },
		});
		expect(s.render({ count: '0' }).className).toContain('count-zero');
	});
});

// ---------------------------------------------------------------------------
// .extend() — base merging
// ---------------------------------------------------------------------------

describe('.extend() base merging', () => {
	const base = styles({ base: 'base-class', variants: {} });

	it('inherits base classes from parent', () => {
		const child = base.extend({ base: 'child-class', variants: {} });
		const result1 = child.render();
		const result2 = child.render();
		expect(result1.className).toContain('base-class');
		expect(result2.className).toContain('child-class');
	});

	it('keeps parent base when no base provided in extend', () => {
		const child = base.extend({ variants: {} });
		expect(child.render().className).toContain('base-class');
	});

	it('extends with only base — no variants key required', () => {
		const child = base.extend({ base: 'extra' });
		const result1 = child.render();
		const result2 = child.render();
		expect(result1.className).toContain('base-class');
		expect(result2.className).toContain('extra');
	});
});

// ---------------------------------------------------------------------------
// .extend() — behavior-only (no variants)
// ---------------------------------------------------------------------------

describe('.extend() behavior-only', () => {
	const parent = styles({
		base: 'parent',
		variants: { size: { sm: 'text-sm', md: 'text-md' } },
		defaults: { size: 'md' },
	});

	it('extends with only defaults — inherits parent variants and base', () => {
		const child = parent.extend({ defaults: { size: 'sm' } });
		const result1 = child.render();
		const result2 = child.render();
		expect(result1.className).toContain('text-sm');
		expect(result2.className).toContain('parent');
	});

	it('extends with only rules — inherited rules still fire', () => {
		const parentRule = vi.fn(() => 'parent-rule');
		const childRule = vi.fn(() => 'child-rule');
		const p = styles({ variants: { x: { a: 'xa' } }, rules: parentRule });
		const child = p.extend({ rules: childRule });
		const result = child.render({ x: 'a' });
		expect(result.className).toContain('xa');
		expect(result.className).toContain('parent-rule');
		expect(result.className).toContain('child-rule');
	});
});

// ---------------------------------------------------------------------------
// .extend() — variant inheritance
// ---------------------------------------------------------------------------

describe('.extend() variant inheritance', () => {
	const parent = styles({
		base: 'parent',
		variants: { size: { sm: 'text-sm', md: 'text-md' } },
		defaults: { size: 'md' },
	});

	it('inherits parent variants', () => {
		const child = parent.extend({
			variants: { intent: { primary: 'bg-primary' } },
		});
		expect(child.render({ size: 'sm' }).className).toContain('text-sm');
	});

	it('adds new variants alongside inherited ones', () => {
		const child = parent.extend({
			variants: { intent: { primary: 'bg-primary' } },
		});
		const result = child.render({ size: 'sm', intent: 'primary' });
		expect(result.className).toContain('text-sm');
		expect(result.className).toContain('bg-primary');
	});

	it('inherits parent defaults', () => {
		const child = parent.extend({
			variants: { intent: { primary: 'bg-primary' } },
		});
		expect(child.render().className).toContain('text-md');
	});

	it('child defaults override parent defaults', () => {
		const child = parent.extend({
			variants: { intent: { primary: 'bg-primary' } },
			defaults: { size: 'sm' },
		});
		const result1 = child.render();
		const result2 = child.render();
		expect(result1.className).toContain('text-sm');
		expect(result2.className).not.toContain('text-md');
	});

	it('child can override a parent variant definition', () => {
		const child = parent.extend({
			variants: { size: { sm: 'p-1', md: 'p-2' } },
		});
		const result1 = child.render({ size: 'sm' });
		const result2 = child.render({ size: 'sm' });
		expect(result1.className).toContain('p-1');
		expect(result2.className).not.toContain('text-sm');
	});
});

// ---------------------------------------------------------------------------
// .extend() — rules composition
// ---------------------------------------------------------------------------

describe('.extend() rules composition', () => {
	it('composes parent and child rules, both firing', () => {
		const parentRule = vi.fn(() => 'parent-rule-class');
		const childRule = vi.fn(() => 'child-rule-class');

		const parent = styles({
			variants: { size: { sm: 'text-sm' } },
			rules: parentRule,
		});
		const child = parent.extend({
			variants: { intent: { primary: 'bg-primary' } },
			rules: childRule,
		});

		const result = child.render({ size: 'sm', intent: 'primary' });
		expect(parentRule).toHaveBeenCalledOnce();
		expect(childRule).toHaveBeenCalledOnce();
		expect(result.className).toContain('parent-rule-class');
		expect(result.className).toContain('child-rule-class');
	});
});

// ---------------------------------------------------------------------------
// .extend() — chained extends
// ---------------------------------------------------------------------------

describe('.extend() chained extends', () => {
	it('supports multiple levels of extension', () => {
		const base = styles({ base: 'a', variants: { x: { '1': 'x1' } } });
		const mid = base.extend({ base: 'b', variants: { y: { '2': 'y2' } } });
		const leaf = mid.extend({ base: 'c', variants: { z: { '3': 'z3' } } });

		const result = leaf.render({ x: '1', y: '2', z: '3' });
		expect(result.className).toContain('a');
		expect(result.className).toContain('b');
		expect(result.className).toContain('c');
		expect(result.className).toContain('x1');
		expect(result.className).toContain('y2');
		expect(result.className).toContain('z3');
	});
});

// ---------------------------------------------------------------------------
// dev-mode unknown key warning
// ---------------------------------------------------------------------------

// import.meta.env.DEV is true in Vitest by default
describe('dev-mode unknown variant key warning', () => {
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('warns when an unknown option is selected', () => {
		const s = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
		});
		// @ts-expect-error intentionally passing invalid option
		s.render({ size: 'xl' });

		// eslint-disable-next-line no-console
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Unknown option "xl" for variant "size"')
		);
	});

	it('does not warn for valid options', () => {
		const s = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
		});
		s.render({ size: 'sm' });

		// eslint-disable-next-line no-console
		expect(console.warn).not.toHaveBeenCalled();
	});
});

// ---------------------------------------------------------------------------
// .defaults property — accessible defaults for component signatures
// ---------------------------------------------------------------------------

describe('.defaults property', () => {
	it('exposes defaults as a property on StylesDef', () => {
		const s = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
			defaults: { size: 'md' },
		});
		expect(s.defaults).toBeDefined();
		expect(s.defaults.size).toBe('md');
	});

	it('provides multiple defaults', () => {
		const s = styles({
			variants: {
				size: { sm: 'text-sm', md: 'text-md' },
				color: { primary: 'text-primary', danger: 'text-danger' },
			},
			defaults: { size: 'md', color: 'primary' },
		});
		expect(s.defaults.size).toBe('md');
		expect(s.defaults.color).toBe('primary');
	});

	it('can be used in component function signatures', () => {
		const buttonStyles = styles({
			variants: {
				size: { sm: 'text-sm', lg: 'text-lg' },
				color: {
					primary: 'bg-primary',
					secondary: 'bg-secondary',
					danger: 'bg-danger',
				},
			},
			defaults: { size: 'lg', color: 'primary' },
		});

		// Simulate component function with defaults from styles
		const Button = ({
			size = buttonStyles.defaults.size,
			color = buttonStyles.defaults.color,
			...props
		}: StyleProps<typeof buttonStyles>) => {
			return buttonStyles.render({ size, color, ...props });
		};

		// With defaults
		const result1 = Button({});
		expect(result1.className).toContain('text-lg');
		expect(result1.className).toContain('bg-primary');

		// With overrides
		const result2 = Button({ size: 'sm', color: 'danger' });
		expect(result2.className).toContain('text-sm');
		expect(result2.className).toContain('bg-danger');
	});

	it('returns empty object when no defaults defined', () => {
		const s = styles({
			variants: { size: { sm: 'text-sm' } },
			defaults: {},
		});
		expect(s.defaults).toEqual({});
	});

	it('works after .extend()', () => {
		const parent = styles({
			variants: { size: { sm: 'text-sm', md: 'text-md' } },
			defaults: { size: 'md' },
		});

		const child = parent.extend({
			variants: { color: { primary: 'text-primary' } },
			defaults: { size: 'sm', color: 'primary' },
		});

		expect(child.defaults.size).toBe('sm');
		expect(child.defaults.color).toBe('primary');
	});

	it('inherits parent defaults when child does not override', () => {
		const parent = styles({
			variants: {
				size: { sm: 'text-sm', md: 'text-md' },
				color: { primary: 'text-primary', danger: 'text-danger' },
			},
			defaults: { size: 'md', color: 'primary' },
		});

		const child = parent.extend({
			variants: { color: { secondary: 'text-secondary' } },
			defaults: { color: 'secondary' },
		});

		expect(child.defaults.size).toBe('md');
		expect(child.defaults.color).toBe('secondary');
	});

	it('provides type-safe access to defaults in component signatures', () => {
		const badgeStyles = styles({
			variants: {
				size: { sm: 'text-sm', md: 'text-md', lg: 'text-lg' },
				color: { primary: 'bg-primary', success: 'bg-success' },
			},
			defaults: { size: 'md', color: 'primary' },
		});

		// This demonstrates the pattern: accessing defaults for IDE discoverability
		const size = badgeStyles.defaults.size;
		const color = badgeStyles.defaults.color;

		expect(size).toBe('md');
		expect(color).toBe('primary');
	});
});
