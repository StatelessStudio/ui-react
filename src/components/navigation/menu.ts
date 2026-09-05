import { ReactNode } from 'react';

/**
 * A menu entry represents a single item in the navigation menu.
 */
export type MenuEntry = {
	name: string;
	path: string;
	icon?: ReactNode;
};

/**
 * A menu category represents a group of related menu entries.
 */
export type MenuCategory = MenuEntry & {
	items?: MenuEntry[];
};

/**
 * Determines if a menu category should be considered open based on the current path.
 *
 * @param itemPath The path of the menu category.
 * @param currentPath The current path in the application.
 * @returns `true` if the menu category should be considered open, `false` otherwise.
 */
export function isMenuCategoryOpen(
	itemPath: string,
	currentPath: string
): boolean {
	return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
}

/**
 * Determines if a menu entry should be considered active based on the current path.
 *
 * @param itemPath The path of the menu entry.
 * @param currentPath The current path in the application.
 * @returns `true` if the menu entry should be considered active, `false` otherwise.
 */
export function isMenuEntryActive(
	itemPath: string,
	currentPath: string
): boolean {
	return currentPath === itemPath;
}
