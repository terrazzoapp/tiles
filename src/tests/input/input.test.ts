import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import { axe } from 'vitest-axe';
import InputTextExample from './text.test.svelte';
import InputNumberExample from './number.test.svelte';
import InputEmailExample from './email.test.svelte';
import InputPasswordExample from './password.test.svelte';
import InputDateExample from './date.test.svelte';

describe('Input', () => {
	test('a11y: text', async () => {
		const { container } = render(InputTextExample);
		expect(
			await axe(container, {
				rules: {
					region: { enabled: false },
				},
			}),
		).toHaveNoViolations();
	});

	test('a11y: number', async () => {
		const { container } = render(InputNumberExample);
		expect(
			await axe(container, {
				rules: {
					region: { enabled: false },
				},
			}),
		).toHaveNoViolations();
	});

	test('a11y: email', async () => {
		const { container } = render(InputEmailExample);
		expect(
			await axe(container, {
				rules: {
					region: { enabled: false },
				},
			}),
		).toHaveNoViolations();
	});

	test('a11y: password', async () => {
		const { container } = render(InputPasswordExample);
		expect(
			await axe(container, {
				rules: {
					region: { enabled: false },
				},
			}),
		).toHaveNoViolations();
	});

	test('a11y: date', async () => {
		const { container } = render(InputDateExample);
		expect(
			await axe(container, {
				rules: {
					region: { enabled: false },
				},
			}),
		).toHaveNoViolations();
	});
});
