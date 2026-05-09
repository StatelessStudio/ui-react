import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes safely without conflicts.
 * Uses clsx for conditional classes and tailwind-merge to resolve specificity.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
