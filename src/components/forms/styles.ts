import { styles } from '@/style-engine';

export const baseFormStyles = styles({
	base:
		'border outline-none focus:ring-2 ' +
		'disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		state: {
			disabled: 'opacity-50 cursor-not-allowed bg-muted border-border',
			readonly: 'bg-muted border-border cursor-default',
		},
	},
});

export const formStyles = baseFormStyles.extend({
	base: 'w-full rounded-md text-sm py-2 px-3',
	variants: {
		state: {
			default: 'border-muted focus:border-primary focus:ring-primary/20',
			error: 'border-danger focus:border-danger focus:ring-danger/20',
		},
		size: {
			sm: 'px-2 py-1 text-sm',
			md: 'px-3 py-2 text-base',
			lg: 'px-4 py-3 text-lg',
		},
	},
	defaults: {
		state: 'default',
		size: 'md',
	},
});

export const checkRadioStyles = baseFormStyles.extend({
	base:
		'peer appearance-none h-4 w-4 rounded-sm ' +
		'text-current cursor-pointer transition-all',
	variants: {
		state: {
			default:
				'border-muted checked:bg-primary ' +
				'focus:ring-primary focus:border-primary',
			error: 'border-danger focus:ring-danger focus:border-danger',
		},
		size: {
			sm: 'w-3 h-3',
			md: 'w-4 h-4',
			lg: 'w-5 h-5',
		},
	},
	defaults: {
		state: 'default',
		size: 'md',
	},
});
