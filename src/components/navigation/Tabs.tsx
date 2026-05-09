import React, { createContext, useContext, useId } from 'react';
import { useControllableState } from '@/hooks';
import { styles, StyleProps, PolymorphicProps } from '@/style-engine';

type TabsRootVariantProps = StyleProps<typeof tabsRootStyles>;
type TabVariantProps = StyleProps<typeof tabStyles>;
type TabColor = NonNullable<TabVariantProps['color']>;
type TabOrientation = NonNullable<TabsRootVariantProps['orientation']>;

interface TabsContextType {
	baseId: string;
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	currentValue: string;
	setCurrentValue: (value: string) => void;
	orientation: TabOrientation;
	color?: TabColor;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const tabColorVariants = {
	primary: '',
	secondary: '',
	accent: '',
	muted: '',
	success: '',
	warning: '',
	danger: '',
	info: '',
	gradient: '',
} as const;

const tabsRootStyles = styles({
	base: 'flex',
	variants: {
		orientation: {
			horizontal: 'flex-col',
			vertical: 'flex-row',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

const tabListStyles = styles({
	base: 'flex',
	variants: {
		orientation: {
			horizontal:
				'flex-row space-x-4 border-b border-slate-200 justify-start w-full overflow-hidden overflow-x-auto',
			vertical:
				'flex-col h-auto w-full items-stretch space-y-2 overflow-hidden overflow-y-auto',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

const tabPanelStyles = styles({
	base: 'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 flex-grow',
	variants: {
		orientation: {
			horizontal: 'mt-2',
			vertical: 'mt-0 ml-6 pl-4',
		},
	},
	defaults: {
		orientation: 'horizontal',
	},
});

const inactiveTabStyles = {
	vertical:
		'border-transparent text-foreground hover:border-secondary hover:bg-secondary/30 hover:text-foreground',
	horizontal:
		'border-transparent text-foreground hover:border-primary hover:text-foreground-muted',
} as const;

const activeTabColors = {
	primary: {
		horizontal: 'border-primary text-primary',
		vertical: 'border-primary text-foreground bg-primary/50',
	},
	secondary: {
		horizontal: 'border-secondary text-secondary',
		vertical: 'border-secondary text-foreground bg-secondary/50',
	},
	accent: {
		horizontal: 'border-accent text-accent',
		vertical: 'border-accent text-foreground bg-accent/50',
	},
	muted: {
		horizontal: 'border-muted-foreground text-muted-foreground',
		vertical: 'border-muted text-foreground bg-muted',
	},
	success: {
		horizontal: 'border-success text-success',
		vertical: 'border-success text-foreground bg-success/50',
	},
	warning: {
		horizontal: 'border-warning text-warning',
		vertical: 'border-warning text-foreground bg-warning/50',
	},
	danger: {
		horizontal: 'border-danger text-danger',
		vertical: 'border-danger text-foreground bg-danger/50',
	},
	info: {
		horizontal: 'border-info text-info',
		vertical: 'border-info text-foreground bg-info/50',
	},
	gradient: {
		horizontal: 'border-primary text-primary',
		vertical: 'border-primary text-foreground bg-primary/10',
	},
} as const;

const tabStyles = styles({
	base: 'inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		orientation: {
			vertical: 'px-3 py-1.5 justify-start w-full text-left border-l-4',
			horizontal: 'px-1 pb-2 pt-1 -mb-px border-b-2',
		},
		state: {
			active: '',
			inactive: '',
		},
		color: tabColorVariants,
	},
	defaults: {
		orientation: 'horizontal',
		state: 'inactive',
		color: 'primary',
	},
	rules: (options) => {
		const color = options.color ?? 'primary';
		const orientation = options.orientation ?? 'horizontal';

		return options.state === 'active'
			? ['font-semibold', activeTabColors[color][orientation]]
			: inactiveTabStyles[orientation];
	},
});

function useTabs() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error('Tabs components must be used within a Tabs provider');
	}
	return context;
}

export interface TabsProps
	extends
		Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
		Pick<TabsRootVariantProps, 'orientation'>,
		Pick<TabVariantProps, 'color'> {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export function Tabs({
	defaultValue,
	value,
	onValueChange,
	orientation = tabsRootStyles.defaults.orientation,
	color = 'primary',
	className = '',
	children,
	...props
}: TabsProps) {
	const baseId = useId();
	const [currentValue, setCurrentValue] = useControllableState<string>({
		value,
		defaultValue: defaultValue || '',
		onChange: onValueChange,
	});

	return (
		<TabsContext.Provider
			value={{
				baseId,
				defaultValue,
				value,
				onValueChange,
				currentValue,
				setCurrentValue,
				orientation: orientation as TabOrientation,
				color,
			}}
		>
			<div
				{...tabsRootStyles.render({ orientation, className })}
				data-orientation={orientation}
				{...props}
			>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
	loop?: boolean;
}

export function TabList({
	className = '',
	loop = true,
	...props
}: TabListProps) {
	const { orientation } = useTabs();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Basic keyboard navigation
		const target = e.target as HTMLElement;
		if (target.getAttribute('role') !== 'tab') {
			return;
		}

		let nextTab: HTMLElement | null = null;
		const tabContainer = e.currentTarget;
		const tabs = Array.from(
			tabContainer.querySelectorAll('[role="tab"]:not([disabled])')
		) as HTMLElement[];
		const index = tabs.indexOf(target);

		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			nextTab = tabs[(index + 1) % tabs.length];
			if (!loop && index === tabs.length - 1) {
				nextTab = null;
			}
		}
		else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			nextTab = tabs[(index - 1 + tabs.length) % tabs.length];
			if (!loop && index === 0) {
				nextTab = null;
			}
		}

		if (nextTab) {
			nextTab.focus();
			// Optional: switch on focus, typical in some tab implementations
			nextTab.click();
		}
	};

	return (
		<div
			role="tablist"
			aria-orientation={orientation}
			{...tabListStyles.render({ orientation, className })}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
}

export interface TabCustomProps {
	value: string;
	icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export type TabProps<E extends React.ElementType> = PolymorphicProps<
	E,
	TabCustomProps
>;

export function Tab<E extends React.ElementType = 'button'>({
	value,
	className = '',
	disabled,
	onClick,
	as,
	icon: Icon,
	children,
	...props
}: TabProps<E>) {
	const Component = as ?? 'button';

	const {
		baseId,
		currentValue,
		setCurrentValue,
		orientation,
		color = 'primary',
	} = useTabs();
	const isActive = currentValue === value;
	const tabId = `${baseId}-tab-${value}`;
	const panelId = `${baseId}-panel-${value}`;

	return (
		<Component
			type={Component === 'button' ? 'button' : undefined}
			id={tabId}
			role="tab"
			aria-selected={isActive}
			aria-controls={panelId}
			disabled={disabled}
			{...tabStyles.render({
				orientation,
				color,
				state: isActive ? 'active' : 'inactive',
				className,
			})}
			onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
				setCurrentValue(value);
				onClick?.(e);
			}}
			tabIndex={isActive ? 0 : -1}
			{...props}
		>
			{Icon && <Icon className="w-4 h-4 mr-1.5" />}
			{children}
		</Component>
	);
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

export function TabPanel({ value, className = '', ...props }: TabPanelProps) {
	const { baseId, currentValue, orientation } = useTabs();
	const isActive = currentValue === value;
	const tabId = `${baseId}-tab-${value}`;
	const panelId = `${baseId}-panel-${value}`;

	if (!isActive) {
		return null;
	}

	return (
		<div
			role="tabpanel"
			id={panelId}
			aria-labelledby={tabId}
			tabIndex={0}
			{...tabPanelStyles.render({ orientation, className })}
			{...props}
		/>
	);
}
