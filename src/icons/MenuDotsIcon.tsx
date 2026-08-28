import React from 'react';

function horizontalDots() {
	return (
		<>
			<circle
				cx="12"
				cy="12"
				r="1"
			/>
			<circle
				cx="5"
				cy="12"
				r="1"
			/>
			<circle
				cx="19"
				cy="12"
				r="1"
			/>
		</>
	);
}

function verticalDots() {
	return (
		<>
			<circle
				cx="12"
				cy="12"
				r="1"
			/>
			<circle
				cx="12"
				cy="5"
				r="1"
			/>
			<circle
				cx="12"
				cy="19"
				r="1"
			/>
		</>
	);
}

export function MenuDotsIcon(
	props: React.SVGProps<SVGSVGElement> & {
		orientation?: 'horizontal' | 'vertical';
	}
) {
	const { orientation = 'vertical', ...svgProps } = props;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...svgProps}
		>
			{orientation === 'vertical' ? verticalDots() : horizontalDots()}
		</svg>
	);
}
