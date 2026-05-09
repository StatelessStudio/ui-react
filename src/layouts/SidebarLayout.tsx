'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MenuIcon } from '@/icons';
import { cn, styles } from '@/style-engine';
import { animate } from '@/animations';

const backdropStyles =
	'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden';

const sidebarContainerStyles = styles({
	base: cn(
		animate({ transitionTransform: true }),
		'fixed inset-y-0 left-0 z-50 transform duration-300',
		'md:relative md:translate-x-0',
		'h-full shrink-0'
	),
	variants: {
		isOpen: {
			true: 'translate-x-0',
			false: '-translate-x-full',
		},
	},
	defaults: {
		isOpen: false,
	},
});

const sidebarContentStyles =
	'h-full w-full max-w-[256px] overflow-y-auto ui-scrollbar ' +
	'bg-background shadow-xl md:shadow-none';

const menuButtonStyles =
	'p-2 -ml-2 rounded-md hover:bg-muted transition-colors ' +
	'focus:outline-none focus:ring-2 focus:ring-primary';

const mainContentStyles =
	'flex-1 overflow-y-auto p-6 md:p-8 ui-scrollbar relative';

export function SidebarLayout({
	children,
	sidebar,
	mobileHeader,
}: {
	children?: ReactNode;
	sidebar: ReactNode;
	mobileHeader?: ReactNode;
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Close the mobile menu automatically if the screen size increases
	// Also close menu on pressing the Escape key
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false);
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsMobileMenuOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div className="flex h-dvh w-full overflow-hidden">
			{/* Mobile Backdrop */}
			{isMobileMenuOpen && (
				<div
					className={backdropStyles}
					onClick={() => setIsMobileMenuOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar Container (Single Render) */}
			<div
				{...sidebarContainerStyles.render({
					isOpen: isMobileMenuOpen,
				})}
			>
				{/* The Actual Sidebar Content */}
				<div
					className={sidebarContentStyles}
					onClick={(e) => {
						// Auto-close on mobile only when clicking links
						if (window.innerWidth < 768) {
							const target = e.target as HTMLElement;

							if (target.closest('a')) {
								setIsMobileMenuOpen(false);
							}
						}
					}}
				>
					{sidebar}
				</div>
			</div>

			{/* Main Content Area */}
			<main className="flex min-w-0 flex-1 flex-col h-full">
				{/* Mobile Header (Hidden on Desktop) */}
				<Header className="md:hidden justify-between shrink-0">
					<div className="flex items-center gap-2">
						<button
							type="button"
							className={menuButtonStyles}
							onClick={() => setIsMobileMenuOpen(true)}
							aria-label="Open mobile menu"
							aria-expanded={isMobileMenuOpen}
							aria-haspopup="dialog"
						>
							<MenuIcon className="h-6 w-6" />
						</button>
						{mobileHeader ? (
							<div className="flex items-center">{mobileHeader}</div>
						) : (
							<span className="font-semibold px-2">Menu</span>
						)}
					</div>
				</Header>

				{/* Page Content */}
				<div className={mainContentStyles}>{children}</div>
			</main>
		</div>
	);
}
