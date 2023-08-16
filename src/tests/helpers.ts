import * as vitestAxe from 'vitest-axe';

export const axe = vitestAxe.configureAxe({
	rules: {
		region: { enabled: false }, // this is stupid
	},
});
