import { describe, expect, test } from 'vitest';
import { clamp, snap } from './number.js';

describe('clamp', () => {
	test('basic', () => {
		expect(clamp(0.5, 0, 1)).toBe(0.5);
		expect(clamp(1.5, 0, 1)).toBe(1);
		expect(clamp(-1, 0, 1)).toBe(0);
	});
});

describe('snap', () => {
	test('basic', () => {
		expect(snap(0.5, 10)).toBe(0.5);
		expect(snap(0.5, 1)).toBe(1);
		expect(snap(0.1 + 0.2, 10)).toBe(0.3);
	});
});
