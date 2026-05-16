import { HTMLAttributes } from 'react';
import { cn, styles } from '@/style-engine';
import { Button } from '../buttons';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
	currentPage: number;
	totalPages: number;
	onPageChange?: (page: number) => void;
}

const paginationItemStyles = styles({
	base:
		'text-sm font-medium rounded-md transition-colors ' +
		'disabled:pointer-events-none h-9 px-4 py-2 ' +
		'border border-muted/50 bg-background text-foreground select-none',
	variants: {
		state: {
			active: 'bg-primary text-white opacity-90 disabled:opacity-90',
			inactive: 'hover:bg-primary/50 hover:text-foreground',
			disabled: 'opacity-50',
			ellipsis: 'text-muted',
		},
	},
	defaults: { state: 'inactive' },
});

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = '',
	...props
}: PaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	const getVisiblePages = (current: number, total: number) => {
		if (total <= 7) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		if (current <= 4) {
			return [1, 2, 3, 4, 5, '...', total];
		}

		if (current >= total - 3) {
			return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
		}

		return [1, '...', current - 1, current, current + 1, '...', total];
	};

	const pages = getVisiblePages(currentPage, totalPages);

	return (
		<nav
			aria-label="Pagination"
			className={cn('flex items-center', className)}
			{...props}
		>
			<ul className="flex flex-wrap items-center gap-2 m-0 p-0 list-none">
				<li>
					<Button
						disabled={currentPage <= 1}
						onClick={() => onPageChange?.(currentPage - 1)}
						{...paginationItemStyles.render({
							state: currentPage <= 1 ? 'disabled' : 'inactive',
						})}
						aria-label="Previous page"
					>
						Previous
					</Button>
				</li>

				{pages.map((page, index) => {
					if (page === '...') {
						return (
							<li
								key={`ellipsis-${index}`}
								aria-hidden="true"
							>
								<span {...paginationItemStyles.render({ state: 'ellipsis' })}>
									...
								</span>
							</li>
						);
					}

					const pageNumber = page as number;
					return (
						<li key={pageNumber}>
							<Button
								disabled={currentPage === pageNumber}
								onClick={() => onPageChange?.(pageNumber)}
								aria-current={currentPage === pageNumber ? 'page' : undefined}
								{...paginationItemStyles.render({
									state: currentPage === pageNumber ? 'active' : 'inactive',
								})}
							>
								{pageNumber}
							</Button>
						</li>
					);
				})}

				<li>
					<Button
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange?.(currentPage + 1)}
						{...paginationItemStyles.render({
							state: currentPage >= totalPages ? 'disabled' : 'inactive',
						})}
						aria-label="Next page"
					>
						Next
					</Button>
				</li>
			</ul>
		</nav>
	);
}
