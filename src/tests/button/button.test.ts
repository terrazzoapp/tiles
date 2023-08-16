import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { axe } from '../helpers.js';
import ButtonBasicExample from './basic.test.svelte';

describe('Button', () => {
	test('a11y: basic', async () => {
		const { container } = render(ButtonBasicExample);
		expect(await axe(container)).toHaveNoViolations();
	});
});
