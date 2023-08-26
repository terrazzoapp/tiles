<script lang="ts">
	import type { Oklab, Oklch, Okhsv, Okhsl, Rgb } from 'culori';
	import { useMode, modeOkhsl, modeOkhsv, modeOklab, modeOklch, modeRgb } from 'culori/fn';
	import { HueGradient, LightnessChromaSquare, getIdealL, getMaxChroma, scaleChroma } from './lib/color-picker.js';
	import { onMount } from 'svelte';

	const toOkhsl = useMode(modeOkhsl);
	const toOkhsv = useMode(modeOkhsv);
	const toOklab = useMode(modeOklab);
	const toOklch = useMode(modeOklch);
	const toRgb = useMode(modeRgb);

	// props
	/** provide a Culori color object to manipulate */
	export let color: Okhsl | Okhsv | Oklab | Oklch | Rgb;
	// prop test
	$: {
		if (typeof color !== 'object') {
			throw new Error('ColorPicker: color prop must be a Culori color object, e.g. `{ mode: "oklch", l: 0, c: 0, h: 0 }`');
		}
		if (color.mode !== 'okhsl' && color.mode !== 'okhsv' && color.mode !== 'oklab' && color.mode !== 'oklch' && color.mode !== 'rgb') {
			throw new Error('ColorPicker: colorspace must be "oklab", "oklch", "okhsl", or "okhsv"');
		}
	}

	// state
	/** changing hues can be a bottleneck; optimize with RAF */
	let hueCalcFrame: number | undefined = undefined;
	/** keep track of hue gradient canvas el */
	let hueGradientEl: HTMLCanvasElement;
	/** keep track of hue gradient canvas DOMRect */
	let hueGradientRect: DOMRect = { left: 0, top: 0, x: 0, y: 0, width: 32, height: 256 } as DOMRect;
	/** turn pointermove events on/off for hue */
	let isDraggingH = false;
	/** turn pointermove events on/off for lightness & chroma */
	let isDraggingLC = false;
	/** keep track of lightness/chroma square canvas el */
	let lcSquareEl: HTMLCanvasElement;
	/** keep track of lightness/chroma square canvas DOMRect */
	let lcSquareRect: DOMRect = { left: 0, top: 0, x: 0, y: 0, width: 256, height: 256 } as DOMRect;
	/** determine what gamut to use for this device ("rgb" = sRGB) */
	let gamut: 'rgb' | 'p3' = 'rgb';

	// derived state
	$: transformColor = (color.mode === 'oklab' ? toOklab : color.mode === 'okhsv' ? toOkhsv : color.mode === 'okhsl' ? toOkhsl : color.mode === 'rgb' ? toRgb : toOklch) as (c: Oklch) => typeof color;
	$: oklch = toOklch(color);
	$: maxChroma = getMaxChroma(getIdealL(oklch.h ?? 0), oklch.h ?? 0, gamut);
	$: lcManager = lcSquareEl ? new LightnessChromaSquare(lcSquareEl) : undefined;
	$: hManager = hueGradientEl ? new HueGradient(hueGradientEl) : undefined;

	// reactivity

	// on oklch change
	$: lcManager?.setHue(oklch.h ?? 0);
	$: chromaX = (Math.min(oklch.c, maxChroma) / maxChroma) * lcSquareRect.width ?? 0;
	$: lightnessY = (1 - Math.min(Math.max(oklch.l, 0), 1)) * (lcSquareRect.height ?? 0);
	$: hueY = Math.min(Math.max((oklch.h ?? 0) / 360, 0), 1) * (hueGradientRect.height ?? 0);

	/** update color while handling gamut transformation/normalization (don’t let colors go out of bounds) */
	function updateColor({ l, c, h }: { l?: number; c?: number; h?: number }) {
		const nextOklch: Oklch = { mode: 'oklch', l: l ?? oklch.l, c: c ?? oklch.c, h: h ?? oklch.h };
		// chroma only needs realignment on hue shift
		if (typeof h === 'number' && h !== oklch.h) {
			nextOklch.c = scaleChroma({ currentChroma: oklch.c, currentHue: oklch.h ?? 0, nextHue: nextOklch.h ?? 0, gamut });
		}
		oklch = nextOklch;
		color = transformColor(oklch);
	}

	/** recalculate on-screen positions of elements */
	function recalcPos() {
		if (lcSquareEl) {
			lcSquareRect = lcSquareEl.getBoundingClientRect();
		}
		if (hueGradientEl) {
			hueGradientRect = hueGradientEl.getBoundingClientRect();
		}
	}

	/** handle pointer events for picker */
	function handleLCSquarePointerDown(evt: PointerEvent) {
		recalcPos();
		isDraggingLC = true;
		handleLCUpdate({ x: (evt.clientX - lcSquareRect.left) / lcSquareRect.width, y: (evt.clientY - lcSquareRect.top) / lcSquareRect.height });
	}
	function handleLCUpdate({ x, y }: { x: number; y: number }) {
		updateColor({ l: 1 - Math.min(Math.max(y, 0), 1), c: Math.min(Math.max(x, 0), 1) * maxChroma });
	}
	function handleHuePointerDown(evt: PointerEvent) {
		recalcPos();
		isDraggingH = true;
		handleHueUpdate((evt.clientY - hueGradientRect.top) / hueGradientRect.height);
	}
	function handleHueUpdate(y: number) {
		if (hueCalcFrame) {
			cancelAnimationFrame(hueCalcFrame);
		}
		hueCalcFrame = requestAnimationFrame(() => {
			const nextHue = 360 * Math.min(Math.max(y, 0), 1);
			updateColor({ h: nextHue });
			hueCalcFrame = undefined;
		});
	}
	function handlePointerMove(evt: PointerEvent) {
		evt.preventDefault(); // prevent selecting / dragging
		if (isDraggingLC) {
			handleLCUpdate({
				x: (evt.clientX - lcSquareRect.left) / lcSquareRect.width,
				y: (evt.clientY - lcSquareRect.top) / lcSquareRect.height,
			});
		}
		if (isDraggingH) {
			handleHueUpdate((evt.clientY - hueGradientRect.top) / hueGradientRect.height);
		}
	}
	function handlePointerUp() {
		isDraggingLC = false;
		isDraggingH = false;
	}

	// lifecycle
	onMount(() => {
		// on mount, enable P3 support
		if (typeof CSS !== 'undefined' && CSS.supports('color(display-p3 0 0 0)')) {
			gamut = 'p3';
		}

		// onMount, update bounding boxes
		recalcPos();

		// handle pointer move & up events globally because a user can drag outside picker bounds, and release the mouse anywhere on page
		addEventListener('pointermove', handlePointerMove);
		addEventListener('pointerup', handlePointerUp);

		// tear down all listeners
		return () => {
			removeEventListener('pointermove', handlePointerMove);
			removeEventListener('pointerup', handlePointerUp);
		};
	});
</script>

<div class="color-picker">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="lc-square" style={`--hue: ${oklch.h}`} on:pointerdown={handleLCSquarePointerDown}>
		<canvas class="canvas canvas--lc-square" bind:this={lcSquareEl} />
		<button aria-label="Lightness/Chroma picker" class="picker picker--lc-square" style={`--x: ${chromaX}px; --y: ${lightnessY}px`}></button>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="hue-gradient" on:pointerdown={handleHuePointerDown}>
		<canvas class="canvas canvas--hue-gradient" bind:this={hueGradientEl} />
		<button aria-label="Hue picker" class="picker picker--hue-gradient" style={`--y: ${hueY}px;`}></button>
	</div>
</div>

<style lang="scss">
	@use '../tokens' as *;

	.canvas {
		height: 100%;
		left: 0;
		position: absolute;
		pointer-events: none;
		top: 0;
		width: 100%;
	}

	.color-picker {
		--lc-square-w: 256px;
		--lc-square-h: 256px;
		--hue-gradient-w: 32px;
		--hue-gradient-h: var(--lc-square-h);

		display: grid;
		gap: 1.5rem;
		grid-template-columns: var(--lc-square-w) var(--hue-gradient-w);
		height: var(--lc-square-h);
		user-select: none;
	}

	.hue-gradient {
		background-image: linear-gradient(
			to bottom,
			oklch(0.7 0.25 0),
			oklch(0.8 0.25 30),
			oklch(0.875 0.25 60),
			oklch(0.9 0.25 90),
			oklch(0.875 0.25 120),
			oklch(0.8 0.25 150),
			oklch(0.7 0.25 180),
			oklch(0.6 0.25 210),
			oklch(0.525 0.25 240),
			oklch(0.5 0.25 270),
			oklch(0.525 0.25 300),
			oklch(0.6 0.25 330),
			oklch(0.7 0.25 360)
		); // cheap approximation (suffers from sRGB blending)
		height: var(--hue-gradient-h);
		position: relative;
		width: var(--hue-gradient-w);
	}

	.lc-square {
		background-color: oklch(0.5 0 0);
		background-image: linear-gradient(to top, #000000, transparent);
		height: var(--lc-square-h);
		position: relative;
		width: var(--lc-square-w);
	}

	.picker {
		left: 0;
		position: absolute;
		top: 0;
		z-index: token('layer.float');

		&--lc-square {
			background: #fff;
			border-radius: 50%;
			border: 2px solid #000;
			height: 1rem;
			left: -0.5rem;
			padding: 0;
			top: -0.5rem;
			transform: translate3d(var(--x, 0), var(--y, 0), 0);
			width: 1rem;
		}

		&--hue-gradient {
			background: none;
			border: none;
			height: 0.75rem;
			left: -0.5rem;
			top: -0.5rem;
			transform: translate3d(0, var(--y, 0), 0);
			width: calc(100% + 1rem);

			&::before,
			&::after {
				border-color: transparent;
				border-style: solid;
				border-width: 0.375rem;
				content: '';
				display: block;
				pointer-events: none;
				position: absolute;
				top: 50%;
				transform: translate3d(0, -50%, 0);
			}

			&::before {
				left: 0;
				border-left-color: token('color.ui.contrast.90');
			}

			&::after {
				right: 0;
				border-right-color: token('color.ui.contrast.90');
			}
		}
	}
</style>
