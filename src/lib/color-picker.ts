import { clampChroma, type Mode, modeOklch, modeP3, modeRgb, type Oklch, useMode } from 'culori/fn';

export interface LightnessChromaSquareOptions {
	hue?: number;
	devicePixelRatio?: number;
}

useMode(modeOklch);
const toP3 = useMode(modeP3);
const toRgb = useMode(modeRgb);

/** Render a Lightness/Chroma color square in WebGL */
export class LightnessChromaSquare {
	canvasEl: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width = 100;
	height = 100;
	hue = 0;

	constructor(canvasEl: HTMLCanvasElement, options?: LightnessChromaSquareOptions) {
		if (!canvasEl) {
			throw new Error('LightnessChromaSquare: no canvas element supplied');
		}
		this.canvasEl = canvasEl;
		const ctx = this.canvasEl.getContext('2d');
		if (!ctx) {
			throw new Error(`LightnessChromaSquare: could not get 2D canvas context`);
		}
		this.ctx = ctx;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === canvasEl) {
					this.width = entry.contentRect.width;
					this.height = entry.contentRect.height;
					this.canvasEl.width = entry.contentRect.width;
					this.canvasEl.height = entry.contentRect.height;
					this.render();
				}
			}
		});
		ro.observe(canvasEl);

		if (typeof options?.hue === 'number') {
			this.hue = options.hue;
		}

		this.render();
	}

	/** set the hue */
	public setHue(hue: number) {
		const rounded = Math.round(hue * 10) / 10; // clamp to 1 decimal place to prevent redrawing this too often
		if (rounded !== this.hue) {
			this.hue = rounded;
			this.render();
		}
	}

	/** rerender the canvas */
	render() {
		const pixelData = new Uint8ClampedArray(this.width * this.height * 4);
		const supportsP3 = CSS.supports('color(display-p3 1 1 1)');
		const idealL = getIdealL(this.hue);
		const maxChroma = getMaxChroma(idealL, this.hue, supportsP3 ? 'p3' : 'rgb');
		const transformFn = supportsP3 ? (toP3 as unknown as typeof toRgb) : toRgb;
		const c: number[] = []; // chroma cache—tiny perf improvement
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const l = 1 - y / this.height;
				if (!c[x]) {
					c[x] = (x / this.width) * maxChroma;
				}
				const pixel: Oklch = { mode: 'oklch', l, c: c[x]!, h: this.hue };
				const rgb = transformFn(pixel);
				const i = y * 4 * this.width + x * 4;
				pixelData[i + 0] = rgb.r * 255;
				pixelData[i + 1] = rgb.g * 255;
				pixelData[i + 2] = rgb.b * 255;
				pixelData[i + 3] = 255.0;
			}
		}
		this.ctx.putImageData(new ImageData(pixelData, this.width, this.height, { colorSpace: supportsP3 ? 'display-p3' : 'srgb' }), 0, 0);
	}
}

/** Render a Hue gradient in WebGL */
export class HueGradient {
	canvasEl: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	height = 100;

	constructor(canvasEl: HTMLCanvasElement) {
		if (!canvasEl) {
			throw new Error('HueGradient: no canvas element supplied');
		}
		this.canvasEl = canvasEl;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) {
			throw new Error('HueGradient: could not get 2D canvas context');
		}
		this.canvasEl.width = 1;
		this.ctx = ctx;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === canvasEl) {
					// width is always 1
					this.height = entry.contentRect.height;
					this.canvasEl.height = entry.contentRect.height;
					this.render();
				}
			}
		});
		ro.observe(canvasEl);

		this.render();
	}

	/** rerender the canvas (should only be necessary on resize) */
	render() {
		const width = 1;
		const pixelData = new Uint8ClampedArray(width * this.height * 4);
		const supportsP3 = CSS.supports('color(display-p3 1 1 1)');
		const transformFn = supportsP3 ? (toP3 as unknown as typeof toRgb) : toRgb;
		for (let y = 0; y < this.height; y++) {
			const hue = 360 * (y / this.height);
			const pixel: Oklch = clampChroma({ mode: 'oklch', l: getIdealL(hue), c: 0.25, h: hue }, supportsP3 ? 'p3' : 'rgb');
			const rgb = transformFn(pixel);
			const i = y * 4;
			pixelData[i + 0] = rgb.r * 255;
			pixelData[i + 1] = rgb.g * 255;
			pixelData[i + 2] = rgb.b * 255;
			pixelData[i + 3] = 255.0;
		}
		this.ctx.putImageData(new ImageData(pixelData, width, this.height, { colorSpace: supportsP3 ? 'display-p3' : 'srgb' }), 0, 0);
	}
}

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
