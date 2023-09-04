import type { Mode } from 'culori';
import { clampChroma } from 'culori';

/**
 * get the ideal lightness for a given hue (only used for hue wheels)
 * this is a little bit of guesswork/subjectivity, but it yields better results than just picking a number across the spectrum (e.g. 70%)
 * can probably be optimized further
 */
export function getIdealL(hue: number) {
	return 0.7 + 0.2 * Math.sin((hue / 360) * 2 * Math.PI);
}

/** get the max possible chroma for a given l & h value */
export function getMaxChroma(l: number, h: number, mode?: Mode) {
	const color = clampChroma({ mode: 'oklch', l, c: 0.4, h }, mode);
	return color.c;
}

/** scale chroma relative to hue change */
export function scaleChroma({ currentChroma, currentHue, nextHue, gamut = 'rgb' }: { currentChroma: number; currentHue: number; nextHue: number; gamut: Mode }) {
	const oldMaxChroma = getMaxChroma(getIdealL(currentHue), currentHue, gamut);
	const newMaxChroma = getMaxChroma(getIdealL(nextHue), nextHue, gamut);
	return (currentChroma / oldMaxChroma) * newMaxChroma;
}
