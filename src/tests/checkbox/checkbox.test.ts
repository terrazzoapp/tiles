import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { axe } from 'vitest-axe';
import CheckboxBasicExample from './basic.test.svelte';

describe('Checkbox', () => {
	test('a11y: basic', async () => {
		const { container } = render(CheckboxBasicExample);
		expect(await axe(container)).toHaveNoViolations();
	});
});
