import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { axe } from '../helpers.js';
import RadioBasicExample from './basic.test.svelte';

describe('Radio', () => {
	test('a11y: basic', async () => {
		const { container } = render(RadioBasicExample);
		expect(await axe(container)).toHaveNoViolations();
	});
});
