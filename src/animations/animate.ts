import { animations } from './animations';

export function animate(
	options: Parameters<typeof animations.render>[0]
): string {
	return animations.render(options).className;
}
