/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * vitest-axe
 */
import { expect } from 'vitest';
import type { AxeMatchers } from 'vitest-axe';
import * as vitestAxe from 'vitest-axe/dist/matchers.js';
expect.extend(vitestAxe);

/** @see https://github.com/chaance/vitest-axe/pull/4 */
declare module 'vitest' {
	interface Assertion extends AxeMatchers {}
	interface AsymmetricMatchersContaining extends AxeMatchers {}
}

/**
 * mock HTML canvas API
 */
import { vi } from 'vitest';

HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any;
