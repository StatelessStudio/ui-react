import React, {
	useState,
	useEffect,
	useCallback,
	createContext,
	useContext,
	ElementType,
} from 'react';
import { createPortal } from 'react-dom';
import { ColorVariant } from '@/colors';
import { styles } from '@/style-engine';
import { MenuItem, MenuItemProps } from '../navigation/MenuItem';
import { useOverlayPosition } from './useOverlayPosition';
import { useOverlay } from './useOverlay';

const contextMenuStyles = styles({
	base:
		'fixed z-50 max-h-[calc(100vh-2rem)] min-w-[8rem] overflow-auto ' +
		'rounded-md border bg-muted shadow-md focus:outline-none ' +
		'flex flex-col py-1 text-foreground border-muted',
	variants: {},
	defaults: {},
});

const contextMenuItemStyles = styles({
	base:
		'px-3 py-2 text-sm rounded-none outline-none ' +
		'focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary ' +
		'focus-visible:ring-inset focus-visible:rounded-sm',
	variants: {},
	defaults: {},
});

interface ContextMenuContextType {
	closeMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	triggerRef: React.RefObject<HTMLElement | null>;
}

export function ContextMenu({
	className = '',
	triggerRef,
	children,
	...props
}: ContextMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [initialPos, setInitialPos] = useState<
		{ x: number; y: number } | undefined
	>(undefined);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const { overlayRef: menuRef } = useOverlay({
		isOpen,
		onClose: handleClose,
		lockBodyScroll: false,
	});

	const { position, mounted } = useOverlayPosition({
		isOpen,
		overlayRef: menuRef,
		initialPosition: initialPos,
	});

	const handleContextMenu = useCallback(
		(e: MouseEvent) => {
			if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
				e.preventDefault();
				setInitialPos({ x: e.clientX, y: e.clientY });
				setIsOpen(true);
			}
			else {
				handleClose();
			}
		},
		[triggerRef, handleClose]
	);

	const handleClickOutside = useCallback(
		(e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				handleClose();
			}
		},
		[handleClose]
	);

	const handleScrollOrResize = useCallback(() => {
		if (isOpen) {
			handleClose();
		}
	}, [isOpen, handleClose]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!isOpen) {
				return;
			}

			if (!menuRef.current) {
				return;
			}

			const items = Array.from(
				menuRef.current.querySelectorAll(
					'[role="menuitem"]:not([aria-disabled="true"])'
				)
			) as HTMLElement[];

			if (!items.length) {
				return;
			}

			const activeElement = document.activeElement as HTMLElement;
			const currentIndex = items.indexOf(activeElement);

			if (e.key === 'ArrowDown') {
				e.preventDefault();

				const nextIndex =
					currentIndex < items.length - 1 ? currentIndex + 1 : 0;

				items[nextIndex].focus();
			}
			else if (e.key === 'ArrowUp') {
				e.preventDefault();

				const prevIndex =
					currentIndex > 0 ? currentIndex - 1 : items.length - 1;

				items[prevIndex].focus();
			}
		},
		[isOpen]
	);

	useEffect(() => {
		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		if (isOpen) {
			window.addEventListener('resize', handleScrollOrResize);
			window.addEventListener('scroll', handleScrollOrResize, {
				capture: true,
			});
		}

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu);
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('resize', handleScrollOrResize);
			window.removeEventListener('scroll', handleScrollOrResize, {
				capture: true,
			});
		};
	}, [
		handleContextMenu,
		handleClickOutside,
		handleKeyDown,
		isOpen,
		handleScrollOrResize,
	]);

	const closeMenu = handleClose;

	if (!isOpen || !mounted) {
		return null;
	}

	return createPortal(
		<ContextMenuContext.Provider value={{ closeMenu }}>
			<div
				ref={menuRef}
				{...contextMenuStyles.render({ className })}
				style={{ top: position.y, left: position.x }}
				role="menu"
				tabIndex={-1}
				{...props}
			>
				{children}
			</div>
		</ContextMenuContext.Provider>,
		document.body
	);
}

export type ContextMenuItemProps<T extends ElementType = 'button'> = Omit<
	MenuItemProps<T>,
	'color' | 'disabled'
> & {
	color?: ColorVariant;
	disabled?: boolean;
};

export function ContextMenuItem<T extends ElementType = 'button'>({
	className = '',
	onClick,
	onKeyDown,
	disabled,
	...props
}: ContextMenuItemProps<T>) {
	const context = useContext(ContextMenuContext);

	const handleClick = (e: MouseEvent) => {
		onClick?.(e);
		context?.closeMenu();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			// In native click scenarios it triggers handleClick automatically,
			// but in keyboard interaction we want to manually close the menu early.
			context?.closeMenu();
		}
		onKeyDown?.(e);
	};

	return (
		<MenuItem
			role="menuitem"
			{...contextMenuItemStyles.render({ className })}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			disabled={disabled}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(props as any)}
		/>
	);
}
