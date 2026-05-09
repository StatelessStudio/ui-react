import { styles } from '@/style-engine';

export const animations = styles({
	base: 'motion-reduce:transition-none motion-reduce:animate-none',
	variants: {
		transitionAll: { true: 'transition-all' },
		transitionColors: { true: 'transition-colors' },
		transitionTransform: { true: 'transition-transform' },
		fadeIn: { true: 'animate-in fade-in' },
		zoomIn: { true: 'animate-in zoom-in-95' },
		easing: {
			'ease-in-out': 'ease-in-out',
			'ease-in': 'ease-in',
			'ease-out': 'ease-out',
			'ease-linear': 'ease-linear',
		},
		duration: {
			short: 'duration-150',
			medium: 'duration-200',
			long: 'duration-300',
		},
	},
	defaults: {
		transitionAll: false,
		transitionColors: false,
		transitionTransform: false,
		fadeIn: false,
		zoomIn: false,
		easing: 'ease-in-out',
		duration: 'medium',
	},
});
